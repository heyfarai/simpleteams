import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { headers } from "next/headers";
import { createClient as createSanityClient } from "@sanity/client";
import { sendEmail } from "@/lib/email/postmark";
import {
  getTeamRegistrationConfirmationHtml,
  getCoachWelcomeHtml,
  getAdminNotificationHtml,
  getTeamNotificationHtml,
  type TeamRegistrationData,
  type CoachWelcomeData,
  type AdminNotificationData
} from "@/lib/email/templates";

// Use environment variables for security
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const sanity = createSanityClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  token: process.env.SANITY_API_TOKEN,
  apiVersion: "2023-05-03",
  useCdn: false,
});

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: Request) {
  const body = await request.text();
  const headersList = await headers();
  const signature = headersList.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "No signature found" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json(
      { error: "Webhook signature verification failed" },
      { status: 400 }
    );
  }

  console.log("Webhook event:", event.type);

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const registrationId = session.metadata?.registrationId;
    const teamId = session.metadata?.teamId;
    const paymentId = session.metadata?.paymentId;

    console.log("Processing completed checkout:", { registrationId, teamId, paymentId });

    // Handle new team registration flow (with teamId and paymentId)
    if (teamId && paymentId) {
      return await handleNewTeamRegistration(session, teamId, paymentId);
    }

    // Handle legacy registration flow (with registrationId)
    if (!registrationId) {
      console.error("No registration ID or team ID in session metadata");
      return NextResponse.json(
        { error: "Missing registration or team ID" },
        { status: 400 }
      );
    }

    try {
      // Get registration details with error handling
      const { data: registration, error: registrationError } = await supabase
        .from("team_registrations")
        .select("*")
        .eq("id", registrationId)
        .single();

      if (registrationError || !registration) {
        console.error(
          "Registration not found:",
          registrationId,
          registrationError
        );
        return NextResponse.json(
          { error: "Registration not found" },
          { status: 404 }
        );
      }

      if (!registration.division_preference) {
        console.error(
          "No division preference found for registration:",
          registrationId
        );
        return NextResponse.json(
          { error: "Missing division preference" },
          { status: 400 }
        );
      }

      // Update registration status with error handling
      const { error: updateError } = await supabase
        .from("team_registrations")
        .update({
          payment_status: "deposit_paid",
          stripe_customer_id: session.customer as string,
        })
        .eq("id", registrationId);

      if (updateError) {
        console.error("Failed to update registration:", updateError);
        return NextResponse.json(
          { error: "Failed to update registration" },
          { status: 500 }
        );
      }

      console.log("Creating team in Sanity:", {
        name: registration.team_name,
        division_id: registration.division_preference,
      });

      // Get season with configurable ID
      const seasonId =
        process.env.NEXT_PUBLIC_ACTIVE_SEASON_ID || "1e418ea3-4b0a-40fd-87b8-96fcf1e89ac3";
      const season = await sanity.fetch(
        `
        *[_type == "season" && _id == $seasonId][0] {
          _id,
          name
        }
      `,
        { seasonId }
      );

      if (!season) {
        console.error("No active season found for ID:", seasonId);
        return NextResponse.json(
          { error: "No active season found" },
          { status: 400 }
        );
      }

      // Verify division exists before proceeding
      const division = await sanity.fetch(
        `
        *[_type == "division" && _id == $divisionId][0] {
          _id,
          name
        }
      `,
        { divisionId: registration.division_preference }
      );

      if (!division) {
        console.error("Division not found:", registration.division_preference);
        return NextResponse.json(
          { error: "Division not found" },
          { status: 400 }
        );
      }

      // Create team in Sanity with proper error handling and initial roster
      const team = await sanity.create({
        _type: "team",
        name: registration.team_name || "Team Name Required",
        shortName: registration.team_name
          ?.split(" ")
          .map((word: string) => word[0])
          .join("")
          .substring(0, 8) || "TBD",
        location: {
          _key: `location-${Date.now()}`,
          city: "TBD",
          region: ""
        },
        staff: [
          {
            _key: `staff-${Date.now()}-1`,
            name: registration.primary_contact_name,
            role: registration.primary_contact_role,
            email: registration.primary_contact_email
          },
          {
            _key: `staff-${Date.now()}-2`,
            name: registration.head_coach_name,
            role: "head-coach",
            email: registration.head_coach_email,
            phone: registration.head_coach_phone
          }
        ],
        stats: {
          _key: `stats-${Date.now()}`,
          wins: 0,
          losses: 0,
          ties: 0
        },
        status: "pending",
        rosters: [
          {
            _key: `roster-${Date.now()}`,
            season: {
              _type: "reference",
              _ref: seasonId
            },
            players: [],
            seasonStats: {
              _key: `season-stats-${Date.now()}`,
              wins: 0,
              losses: 0,
              ties: 0,
              pointsFor: 0,
              pointsAgainst: 0,
              homeRecord: "0-0",
              awayRecord: "0-0",
              conferenceRecord: "0-0"
            }
          }
        ]
      });

      console.log("Team created in Sanity:", team);

      // Add team to division with improved error handling
      try {
        // First, get the season with full activeDivisions data
        const seasonWithDivisions = await sanity.fetch(
          `
          *[_type == "season" && _id == $seasonId][0] {
            _id,
            name,
            activeDivisions[] {
              _key,
              division->{_id},
              teams,
              status,
              teamLimits
            }
          }
        `,
          { seasonId }
        );

        if (!seasonWithDivisions) {
          throw new Error("Could not fetch season with divisions");
        }

        console.log("Season with divisions:", seasonWithDivisions);

        // Find the activeDivision that matches our division preference
        const targetActiveDivision = seasonWithDivisions.activeDivisions?.find(
          (ad: any) => ad.division._id === registration.division_preference
        );

        if (!targetActiveDivision) {
          console.error("Active division not found for division:", registration.division_preference);
          throw new Error(`Active division not found for division: ${registration.division_preference}`);
        }

        console.log("Target active division found:", targetActiveDivision);

        // Add team reference to the activeDivision's teams array
        const newTeamRef = {
          _key: `team-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          _type: "reference",
          _ref: team._id,
        };

        const updatedTeams = [...(targetActiveDivision.teams || []), newTeamRef];

        // Update the specific activeDivision by its _key
        await sanity
          .patch(seasonId)
          .set({
            [`activeDivisions[_key=="${targetActiveDivision._key}"].teams`]: updatedTeams
          })
          .commit();

        console.log("Team added to division successfully:", {
          teamId: team._id,
          divisionKey: targetActiveDivision._key,
          divisionId: registration.division_preference
        });
      } catch (patchError) {
        console.error("Failed to add team to division:", patchError);
        // Team was created but not added to division - log for manual intervention
        console.error(
          "Manual intervention required - Team created but not added to division:",
          {
            teamId: team._id,
            divisionId: registration.division_preference,
            seasonId: season._id,
          }
        );
      }

      // Update registration with Sanity team ID
      const { error: finalUpdateError } = await supabase
        .from("team_registrations")
        .update({
          sanity_team_id: team._id,
        })
        .eq("id", registrationId);

      if (finalUpdateError) {
        console.error(
          "Failed to update registration with team ID:",
          finalUpdateError
        );
        return NextResponse.json(
          { error: "Failed to update registration with team ID" },
          { status: 500 }
        );
      }

      console.log("Registration processed successfully:", {
        registrationId,
        teamId: team._id,
        divisionId: registration.division_preference,
      });

      // TODO: Send confirmation email
      // TODO: Consider implementing idempotency checks
      // TODO: Add webhook retry mechanism for failed operations
    } catch (error) {
      console.error("Error processing checkout completion:", error);
      return NextResponse.json(
        { error: "Internal server error processing payment" },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ received: true });
}

async function handleNewTeamRegistration(session: Stripe.Checkout.Session, teamId: string, paymentId: string) {
  console.log("Processing new team registration payment:", { teamId, paymentId });

  try {
    // Update team status to active
    const { error: teamError } = await supabase
      .from("teams")
      .update({
        status: "active",
        payment_status: "paid"
      })
      .eq("id", teamId);

    if (teamError) {
      console.error("Error updating team:", teamError);
      return NextResponse.json(
        { error: "Failed to update team status" },
        { status: 500 }
      );
    }

    // Get team info to get user_id
    const { data: teamInfo } = await supabase
      .from("teams")
      .select("user_id")
      .eq("id", teamId)
      .single();

    // Update payment status
    const { error: paymentError } = await supabase
      .from("team_payments")
      .update({
        status: "completed",
        stripe_payment_intent_id: session.payment_intent as string,
        paid_at: new Date().toISOString(),
        stripe_session_id: session.id,
        user_id: teamInfo?.user_id // Ensure user_id is populated
      })
      .eq("id", paymentId);

    if (paymentError) {
      console.error("Error updating payment:", paymentError);
      return NextResponse.json(
        { error: "Failed to update payment status" },
        { status: 500 }
      );
    }

    // Get team details for Sanity creation
    const { data: team, error: teamFetchError } = await supabase
      .from("teams")
      .select("*")
      .eq("id", teamId)
      .single();

    if (teamFetchError || !team) {
      console.error("Error fetching team details:", teamFetchError);
      return NextResponse.json(
        { error: "Failed to fetch team details" },
        { status: 500 }
      );
    }

    // Create team in Sanity (similar to existing logic but adapted for new structure)
    await createTeamInSanity(team, session);

    // Send confirmation emails (structure ready for implementation)
    await sendConfirmationEmails(team, session);

    console.log(`Team ${teamId} payment completed successfully`);
    return NextResponse.json({ received: true, teamId });

  } catch (error) {
    console.error("Error processing new team registration:", error);
    return NextResponse.json(
      { error: "Internal server error processing payment" },
      { status: 500 }
    );
  }
}

async function createTeamInSanity(team: any, session: Stripe.Checkout.Session) {
  const seasonId = process.env.NEXT_PUBLIC_ACTIVE_SEASON_ID || "1e418ea3-4b0a-40fd-87b8-96fcf1e89ac3";

  try {
    // Get season
    const season = await sanity.fetch(
      `*[_type == "season" && _id == $seasonId][0] { _id, name }`,
      { seasonId }
    );

    if (!season) {
      console.error("No active season found for ID:", seasonId);
      throw new Error("No active season found");
    }

    // Verify division exists
    if (!team.division_preference) {
      console.error("No division preference for team:", team.id);
      throw new Error("No division preference");
    }

    const division = await sanity.fetch(
      `*[_type == "division" && _id == $divisionId][0] { _id, name }`,
      { divisionId: team.division_preference }
    );

    if (!division) {
      console.error("Division not found:", team.division_preference);
      throw new Error("Division not found");
    }

    // Create team in Sanity with initial roster for the active season
    const sanityTeam = await sanity.create({
      _type: "team",
      name: team.name || "Team Name Required",
      shortName: team.name
        ?.split(" ")
        .map((word: string) => word[0])
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
      rosters: [
        {
          _key: `roster-${Date.now()}`,
          season: {
            _type: "reference",
            _ref: seasonId
          },
          players: [],
          seasonStats: {
            _key: `season-stats-${Date.now()}`,
            wins: 0,
            losses: 0,
            ties: 0,
            pointsFor: 0,
            pointsAgainst: 0,
            homeRecord: "0-0",
            awayRecord: "0-0",
            conferenceRecord: "0-0"
          }
        }
      ],
      supabaseTeamId: team.id // Add reference to Supabase team
    });

    console.log("Team created in Sanity:", sanityTeam);

    // Add team to division
    await addTeamToDivision(seasonId, team.division_preference, sanityTeam._id);

    // Update team record with Sanity ID
    await supabase
      .from("teams")
      .update({ sanity_team_id: sanityTeam._id })
      .eq("id", team.id);

    console.log("Team successfully added to Sanity and division");

  } catch (error) {
    console.error("Error creating team in Sanity:", error);
    throw error;
  }
}

async function addTeamToDivision(seasonId: string, divisionId: string, teamId: string) {
  try {
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
      (ad: any) => ad.division._id === divisionId
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

    console.log("Team added to division successfully:", {
      teamId,
      divisionKey: targetActiveDivision._key,
      divisionId
    });

  } catch (error) {
    console.error("Failed to add team to division:", error);
    throw error;
  }
}

async function sendConfirmationEmails(team: any, session: Stripe.Checkout.Session) {
  try {
    const packageDetails = getPackageDetails(session.metadata?.selectedPackage || '');

    // Email data structure for future email service integration
    const emailData = {
      // Primary contact email
      primaryContact: {
        to: team.primary_contact_email,
        subject: `Registration Confirmed - ${team.name}`,
        template: 'team-registration-confirmation',
        data: {
          teamName: team.name,
          contactName: team.primary_contact_name,
          packageName: packageDetails.name,
          packagePrice: packageDetails.price,
          paymentAmount: (session.amount_total || 0) / 100,
          registrationId: team.id,
          nextSteps: [
            'Access your team dashboard',
            'Complete roster submission',
            'Review league schedule',
            'Download league handbook'
          ],
          dashboardUrl: `${process.env.NEXT_PUBLIC_URL}/dashboard/team/${team.id}`,
          supportEmail: 'support@yourleague.com'
        }
      },

      // Team contact email (if different)
      teamContact: team.contact_email !== team.primary_contact_email ? {
        to: team.contact_email,
        subject: `Registration Confirmed - ${team.name}`,
        template: 'team-registration-notification',
        data: {
          teamName: team.name,
          packageName: packageDetails.name,
          registrationId: team.id
        }
      } : null,

      // Head coach email (if provided)
      headCoach: team.head_coach_email ? {
        to: team.head_coach_email,
        subject: `Welcome Coach - ${team.name}`,
        template: 'coach-welcome',
        data: {
          teamName: team.name,
          coachName: team.head_coach_name,
          packageName: packageDetails.name,
          dashboardUrl: `${process.env.NEXT_PUBLIC_URL}/dashboard/team/${team.id}`,
          coachingResources: [
            'League coaching guidelines',
            'Player development resources',
            'Game strategy materials'
          ]
        }
      } : null,

      // Admin notification
      adminNotification: {
        to: process.env.ADMIN_EMAIL || 'admin@yourleague.com',
        subject: `New Team Registration - ${team.name}`,
        template: 'admin-new-registration',
        data: {
          teamName: team.name,
          packageName: packageDetails.name,
          contactName: team.primary_contact_name,
          contactEmail: team.primary_contact_email,
          paymentAmount: (session.amount_total || 0) / 100,
          registrationId: team.id,
          adminDashboardUrl: `${process.env.NEXT_PUBLIC_URL}/admin/teams/${team.id}`
        }
      }
    };

    // Send emails using Postmark
    console.log('Sending confirmation emails for team:', team.name);

    // 1. Send primary contact confirmation email
    const primaryContactHtml = getTeamRegistrationConfirmationHtml(emailData.primaryContact.data as TeamRegistrationData);
    await sendEmail({
      to: emailData.primaryContact.to,
      subject: emailData.primaryContact.subject,
      html: primaryContactHtml
    });

    // 2. Send team contact notification (if different email)
    if (emailData.teamContact) {
      const teamContactHtml = getTeamNotificationHtml(emailData.teamContact.data);
      await sendEmail({
        to: emailData.teamContact.to,
        subject: emailData.teamContact.subject,
        html: teamContactHtml
      });
    }

    // 3. Send head coach welcome email (if provided)
    if (emailData.headCoach) {
      const coachHtml = getCoachWelcomeHtml(emailData.headCoach.data as CoachWelcomeData);
      await sendEmail({
        to: emailData.headCoach.to,
        subject: emailData.headCoach.subject,
        html: coachHtml
      });
    }

    // 4. Send admin notification
    const adminHtml = getAdminNotificationHtml(emailData.adminNotification.data as AdminNotificationData);
    await sendEmail({
      to: emailData.adminNotification.to,
      subject: emailData.adminNotification.subject,
      html: adminHtml
    });

    console.log(`All confirmation emails sent successfully for team: ${team.name}`);

  } catch (error) {
    console.error('Error preparing confirmation emails:', error);
    // Don't throw - email failures shouldn't break registration completion
  }
}

function getPackageDetails(packageId: string) {
  const packages = {
    'full-season': {
      name: 'Full Season Team Registration',
      price: '$3,495',
      description: '12+ games + playoffs'
    },
    'two-session': {
      name: 'Two Session Pack Registration',
      price: '$1,795',
      description: '6 games max (3 per session)'
    },
    'pay-per-session': {
      name: 'Pay Per Session Registration',
      price: '$795',
      description: '3 games max per session'
    }
  };

  return packages[packageId as keyof typeof packages] || {
    name: 'Team Registration',
    price: 'TBD',
    description: 'Basketball league registration'
  };
}
