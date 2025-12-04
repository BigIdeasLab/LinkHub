import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "@/middleware/auth";

export async function GET(request: NextRequest) {
  try {
    const user = await authMiddleware(request);
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // TODO: Fetch analytics overview
    return NextResponse.json({
      totalViews: 0,
      totalClicks: 0,
    });
  } catch (error) {
    console.error("Get overview error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
