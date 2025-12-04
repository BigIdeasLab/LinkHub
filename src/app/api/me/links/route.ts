import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "@/middleware/auth";
import { getAdminSupabase } from "@/lib/server/supabase";

export async function GET(request: NextRequest) {
  try {
    const user = await authMiddleware(request);
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Fetch user's links
    const adminSupabase = getAdminSupabase();

    // Get the user's profile id
    const { data: profile, error: profileError } = await adminSupabase
      .from("profiles")
      .select("id")
      .eq("user_id", user.id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json([]);
    }

    const { data: links, error } = await adminSupabase
      .from("links")
      .select("*")
      .eq("profile_id", profile.id)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Get links error:", error);
      return NextResponse.json([]);
    }

    return NextResponse.json(
      links?.map((link) => ({
        id: link.id,
        title: link.title,
        url: link.url,
        isActive: link.is_active,
        platform: link.platform,
      })) || []
    );
  } catch (error) {
    console.error("Get links error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await authMiddleware(request);
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const adminSupabase = getAdminSupabase();

    // Get the user's profile id
    const { data: profile, error: profileError } = await adminSupabase
      .from("profiles")
      .select("id")
      .eq("user_id", user.id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json(
        { message: "Profile not found" },
        { status: 404 }
      );
    }

    // Create new link
    const { data: link, error } = await adminSupabase
      .from("links")
      .insert({
        profile_id: profile.id,
        title: body.title,
        url: body.url,
        platform: body.platform,
        is_active: true,
      })
      .select()
      .single();

    if (error) {
      console.error("Create link error:", error);
      return NextResponse.json(
        { message: "Failed to create link" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        id: link.id,
        title: link.title,
        url: link.url,
        isActive: link.is_active,
        platform: link.platform,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create link error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
