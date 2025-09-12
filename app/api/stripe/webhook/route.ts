import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { headers } from "next/headers";
import { createClient as createSanityClient } from "@sanity/client";

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
  const signature = request.headers.get("stripe-signature");

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
    console.log("Processing completed checkout:", { registrationId });

    if (!registrationId) {
      console.error("No registration ID in session metadata");
      return NextResponse.json(
        { error: "Missing registration ID" },
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

      // Create team in Sanity with proper error handling
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
        rosters: []
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
