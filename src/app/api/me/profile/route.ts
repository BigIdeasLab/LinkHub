import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "@/middleware/auth";
import { getAdminSupabase } from "@/lib/server/supabase";

export async function GET(request: NextRequest) {
  try {
    const user = await authMiddleware(request);
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Fetch profile from database
    const adminSupabase = getAdminSupabase();
    const { data: profile, error } = await adminSupabase
      .from("profiles")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (error) {
      console.error("Database fetch error:", error);
      return NextResponse.json(
        { message: "Failed to fetch profile" },
        { status: 500 }
      );
    }

    if (!profile) {
      return NextResponse.json(
        { message: "Profile not found" },
        { status: 404 }
      );
    }

    // Return the user's profile data
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

export async function PUT(request: NextRequest) {
  try {
    const user = await authMiddleware(request);
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // Update profile in database
    const adminSupabase = getAdminSupabase();
    const { data: profile, error } = await adminSupabase
      .from("profiles")
      .update({
        username: body.username,
        display_name: body.displayName,
        bio: body.bio,
        avatar_url: body.avatarUrl,
        theme_settings: body.theme,
        onboarded: body.onboarded,
      })
      .eq("user_id", user.id)
      .select()
      .single();

    if (error) {
      console.error("Database update error:", error);
      return NextResponse.json(
        { message: "Failed to update profile" },
        { status: 500 }
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
    console.error("Update profile error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
