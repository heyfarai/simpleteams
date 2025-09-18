#!/usr/bin/env node

/**
 * Webhook Recovery Script
 *
 * This script processes teams that have successful payments but missing Sanity records
 * due to missed webhook events. It quietly recovers without user drama.
 */

const { createClient } = require('@supabase/supabase-js');
const { createClient: createSanityClient } = require('@sanity/client');
const Stripe = require('stripe');

// Initialize clients
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const sanity = createSanityClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "dev",
  token: process.env.SANITY_API_TOKEN,
  apiVersion: "2023-05-03",
  useCdn: false,
});

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

async function recoverMissedWebhooks() {
  console.log('🔍 Checking for teams missing Sanity records...');

  try {
    // Find teams with payment records but no Sanity team ID
    const { data: teams, error } = await supabase
      .from('teams')
      .select(`
        *,
        team_payments(*)
      `)
      .is('sanity_team_id', null)
      .order('created_at', { ascending: false });

    if (error) throw error;

    const teamsToRecover = [];

    // Check each team to see if payment was actually successful via Stripe
    for (const team of teams) {
      if (!team.team_payments || team.team_payments.length === 0) continue;

      const payment = team.team_payments[0]; // Get latest payment
      if (!payment.stripe_session_id) continue;

      try {
        // Check actual payment status from Stripe
        const session = await stripe.checkout.sessions.retrieve(payment.stripe_session_id);

        if (session.payment_status === 'paid') {
          teamsToRecover.push({
            team,
            payment,
            session
          });
        }
      } catch (stripeError) {
        console.log(`⚠️ Could not verify payment for team ${team.id}: ${stripeError.message}`);
      }
    }

    if (teamsToRecover.length === 0) {
      console.log('✅ No teams need recovery');
      return;
    }

    console.log(`🔧 Found ${teamsToRecover.length} teams to recover:`);

    for (const { team, payment, session } of teamsToRecover) {
      console.log(`   - ${team.name} (${team.contact_email})`);
    }

    console.log('\n🚀 Starting recovery process...');

    // Process each team
    for (const { team, payment, session } of teamsToRecover) {
      try {
        await processTeamRecovery(team, payment, session);
        console.log(`✅ Recovered: ${team.name}`);
      } catch (error) {
        console.error(`❌ Failed to recover ${team.name}:`, error.message);
      }
    }

    console.log('\n🎉 Recovery complete!');

  } catch (error) {
    console.error('❌ Recovery script failed:', error);
    process.exit(1);
  }
}

async function processTeamRecovery(team, payment, session) {
  // 1. Update team and payment status in Supabase
  await supabase
    .from('teams')
    .update({
      status: 'active',
      payment_status: 'completed'
    })
    .eq('id', team.id);

  await supabase
    .from('team_payments')
    .update({
      status: 'completed',
      paid_at: new Date().toISOString()
    })
    .eq('id', payment.id);

  // 2. Create team in Sanity
  const sanityTeam = await createTeamInSanity(team, session);

  // 3. Update team with Sanity ID
  await supabase
    .from('teams')
    .update({ sanity_team_id: sanityTeam._id })
    .eq('id', team.id);

  return sanityTeam;
}

async function createTeamInSanity(team, session) {
  const seasonId = process.env.NEXT_PUBLIC_ACTIVE_SEASON_ID || "1e418ea3-4b0a-40fd-87b8-96fcf1e89ac3";

  // Get season
  const season = await sanity.fetch(
    `*[_type == "season" && _id == $seasonId][0] { _id, name }`,
    { seasonId }
  );

  if (!season) {
    throw new Error("No active season found");
  }

  // Verify division exists
  if (!team.division_preference) {
    throw new Error("No division preference");
  }

  const division = await sanity.fetch(
    `*[_type == "division" && _id == $divisionId][0] { _id, name }`,
    { divisionId: team.division_preference }
  );

  if (!division) {
    throw new Error("Division not found");
  }

  // Create team in Sanity
  const sanityTeam = await sanity.create({
    _type: "team",
    name: team.name || "Team Name Required",
    shortName: team.name
      ?.split(" ")
      .map((word) => word[0])
      .join("")
      .substring(0, 8) || "TBD",
    location: {
      _key: `location-${Date.now()}`,
      city: team.city || "TBD",
      region: team.region || ""
    },
    colors: {
      _key: `colors-${Date.now()}`,
      primary: team.primary_color || "#1e40af",
      secondary: team.secondary_color || "#fbbf24",
      accent: team.accent_color || null
    },
    staff: [
      {
        _key: `staff-${Date.now()}-1`,
        name: team.primary_contact_name,
        role: team.primary_contact_role || "manager",
        email: team.primary_contact_email,
        phone: team.primary_contact_phone
      },
      ...(team.head_coach_name ? [{
        _key: `staff-${Date.now()}-2`,
        name: team.head_coach_name,
        role: "head-coach",
        email: team.head_coach_email,
        phone: team.head_coach_phone
      }] : [])
    ],
    stats: {
      _key: `stats-${Date.now()}`,
      wins: 0,
      losses: 0,
      ties: 0
    },
    status: "active",
    rosters: []
  });

  // Add team to division
  await addTeamToDivision(seasonId, team.division_preference, sanityTeam._id);

  return sanityTeam;
}

async function addTeamToDivision(seasonId, divisionId, teamId) {
  // Get season with divisions
  const seasonWithDivisions = await sanity.fetch(
    `*[_type == "season" && _id == $seasonId][0] {
      _id,
      name,
      activeDivisions[] {
        _key,
        division->{_id},
        teams,
        status,
        teamLimits
      }
    }`,
    { seasonId }
  );

  if (!seasonWithDivisions) {
    throw new Error("Could not fetch season with divisions");
  }

  // Find the activeDivision that matches our division preference
  const targetActiveDivision = seasonWithDivisions.activeDivisions?.find(
    (ad) => ad.division._id === divisionId
  );

  if (!targetActiveDivision) {
    throw new Error(`Active division not found for division: ${divisionId}`);
  }

  // Add team reference to the activeDivision's teams array
  const newTeamRef = {
    _key: `team-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    _type: "reference",
    _ref: teamId,
  };

  const updatedTeams = [...(targetActiveDivision.teams || []), newTeamRef];

  // Update the specific activeDivision by its _key
  await sanity
    .patch(seasonId)
    .set({
      [`activeDivisions[_key=="${targetActiveDivision._key}"].teams`]: updatedTeams
    })
    .commit();
}

// Run the recovery
if (require.main === module) {
  recoverMissedWebhooks()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('Recovery failed:', error);
      process.exit(1);
    });
}

module.exports = { recoverMissedWebhooks };