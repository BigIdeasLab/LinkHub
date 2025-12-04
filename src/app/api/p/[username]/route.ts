import { NextRequest, NextResponse } from "next/server";
import { getAdminSupabase } from "@/lib/server/supabase";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params;

    // Fetch public profile from database
    const adminSupabase = getAdminSupabase();
    const { data: profile, error } = await adminSupabase
      .from("profiles")
      .select("*")
      .eq("username", username)
      .single();

    if (error || !profile) {
      console.error("Profile fetch error:", error);
      return NextResponse.json(
        { message: "Profile not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      username: profile.username,
      displayName: profile.display_name,
      bio: profile.bio,
      avatarUrl: profile.avatar_url,
      theme: profile.theme_settings,
      onboarded: profile.onboarded,
    });
  } catch (error) {
    console.error("Get profile error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
