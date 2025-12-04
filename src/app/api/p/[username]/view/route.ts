import { NextRequest, NextResponse } from "next/server";
import { getAdminSupabase } from "@/lib/server/supabase";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params;
    const body = await request.json();
    const adminSupabase = getAdminSupabase();

    // Get the profile to find the profile id
    const { data: profile, error: profileError } = await adminSupabase
      .from("profiles")
      .select("id")
      .eq("username", username)
      .single();

    if (profileError || !profile) {
      return NextResponse.json({ message: "Profile not found" }, { status: 404 });
    }

    // Track the page view (one per day per profile)
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
    const { error: insertError } = await adminSupabase
      .from("page_views")
      .insert({
        profile_id: profile.id,
        view_date: today,
      })
      .select(); // Just to check if it succeeds

    if (insertError) {
      // Ignore duplicate key errors (same day view already tracked)
      if (insertError.code !== '23505') {
        console.error("Track view error:", insertError);
      }
      // Don't fail the request for tracking errors
      return NextResponse.json({ message: "View tracked" });
    }

    return NextResponse.json({ message: "View tracked" });
  } catch (error) {
    console.error("Track view error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
