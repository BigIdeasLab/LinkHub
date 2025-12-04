import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "@/middleware/auth";

export async function PUT(request: NextRequest) {
  try {
    const user = await authMiddleware(request);
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // TODO: Reorder links
    return NextResponse.json({ message: "Links reordered" });
  } catch (error) {
    console.error("Reorder links error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
