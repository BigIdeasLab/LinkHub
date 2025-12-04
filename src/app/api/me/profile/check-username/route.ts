import { NextRequest, NextResponse } from "next/server";
import { getAdminSupabase } from "@/lib/server/supabase";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username");

    if (!username) {
      return NextResponse.json(
        { message: "Username is required" },
        { status: 400 }
      );
    }

    // Check if username is already taken
    const adminSupabase = getAdminSupabase();
    const { data: profile, error } = await adminSupabase
      .from("profiles")
      .select("id")
      .eq("username", username)
      .single();

    // If error is "PGRST116", it means no rows were found (username is available)
    // Otherwise, the username is taken
    const available = error?.code === "PGRST116" || !profile;

    return NextResponse.json({ available });
  } catch (error) {
    console.error("Check username error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
