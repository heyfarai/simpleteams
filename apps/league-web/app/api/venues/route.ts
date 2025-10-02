import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Use service role key for server-side API routes
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET() {
  try {
    const { data: venues, error } = await supabase
      .from("venues")
      .select("id, name, address, city, state")
      .order("name");

    if (error) {
      throw error;
    }

    return NextResponse.json(venues || []);
  } catch (error) {
    console.error("Error fetching venues:", error);
    return NextResponse.json(
      { error: "Failed to fetch venues" },
      { status: 500 }
    );
  }
}