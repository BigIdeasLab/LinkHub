import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "@/middleware/auth";

export async function POST(request: NextRequest) {
  try {
    const user = await authMiddleware(request);
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // TODO: Handle avatar upload
    return NextResponse.json({ message: "Avatar uploaded" });
  } catch (error) {
    console.error("Upload avatar error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
