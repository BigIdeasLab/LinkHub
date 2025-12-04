import { NextRequest, NextResponse } from "next/server";
import { getAdminSupabase } from "@/lib/server/supabase";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = getAdminSupabase();

    // Insert click event (trigger will auto-increment click_count)
    const { error: eventError } = await supabase
      .from("link_click_events")
      .insert({ link_id: parseInt(id) });

    if (eventError) {
      console.error("Failed to insert click event:", eventError);
      return NextResponse.json(
        { message: "Failed to track click" },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: "Click tracked" });
  } catch (error) {
    console.error("Track click error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
