import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/client-safe";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Check if user exists in Supabase Auth
    const { data: users, error } = await supabaseAdmin!.auth.admin.listUsers();

    if (error) {
      console.error("Error checking user existence:", error);
      return NextResponse.json(
        { error: "Failed to check email" },
        { status: 500 }
      );
    }

    const userExists = users.users.some(user => user.email === email);

    // If user exists, also check if they already have a team registration
    let hasExistingRegistration = false;
    if (userExists) {
      const { data: registrations, error: regError } = await supabaseAdmin!
        .from("team_registrations")
        .select("id, team_id")
        .eq("primary_contact_email", email)
        .eq("status", "approved");

      if (!regError && registrations && registrations.length > 0) {
        hasExistingRegistration = true;
      }
    }

    return NextResponse.json({
      exists: userExists,
      hasExistingRegistration,
    });
  } catch (error) {
    console.error("Error in check-email route:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}