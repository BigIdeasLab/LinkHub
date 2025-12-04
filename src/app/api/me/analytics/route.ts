import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "@/middleware/auth";
import { getAdminSupabase } from "@/lib/server/supabase";

export async function GET(request: NextRequest) {
  try {
    const user = await authMiddleware(request);
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const supabase = getAdminSupabase();

    // Get user's profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("id")
      .eq("user_id", user.id)
      .single();

    if (!profile) {
      return NextResponse.json(
        { message: "Profile not found" },
        { status: 404 }
      );
    }

    // Get total views (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { data: viewsData } = await supabase
      .from("page_views")
      .select("total_views")
      .eq("profile_id", profile.id)
      .gte("view_date", thirtyDaysAgo.toISOString().split("T")[0]);

    const totalViews = viewsData?.reduce((sum, row) => sum + (row.total_views || 0), 0) || 0;

    // Get user's links
    const { data: links } = await supabase
      .from("links")
      .select("id, click_count")
      .eq("profile_id", profile.id);

    // Sum click counts from links table (more reliable)
    const totalClicks = links?.reduce((sum, link) => sum + (link.click_count || 0), 0) || 0;

    // Get top links
    const { data: topLinks } = await supabase
      .from("links")
      .select("id, title, platform, click_count")
      .eq("profile_id", profile.id)
      .order("click_count", { ascending: false })
      .limit(5);

    return NextResponse.json({
      last30Days: {
        views: totalViews,
        clicks: totalClicks,
      },
      topLinks: (topLinks || []).map((link: any) => ({
        id: link.id,
        title: link.title,
        platform: link.platform,
        clicks: link.click_count,
      })),
    });
  } catch (error) {
    console.error("Get analytics error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
