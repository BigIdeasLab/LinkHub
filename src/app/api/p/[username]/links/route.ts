import { NextRequest, NextResponse } from "next/server";
import { getAdminSupabase } from "@/lib/server/supabase";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params;
    const adminSupabase = getAdminSupabase();

    // Get the profile to find the profile id
    const { data: profile, error: profileError } = await adminSupabase
      .from("profiles")
      .select("id")
      .eq("username", username)
      .single();

    if (profileError || !profile) {
      return NextResponse.json([]);
    }

    // Fetch links for this user
    const { data: links, error: linksError } = await adminSupabase
      .from("links")
      .select("*")
      .eq("profile_id", profile.id)
      .eq("is_active", true)
      .order("created_at", { ascending: true });

    if (linksError) {
      console.error("Get links error:", linksError);
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
