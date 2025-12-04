import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "@/middleware/auth";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await authMiddleware(request);
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // TODO: Update link
    return NextResponse.json({ message: "Link updated" });
  } catch (error) {
    console.error("Update link error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await authMiddleware(request);
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // TODO: Delete link
    return NextResponse.json({ message: "Link deleted" });
  } catch (error) {
    console.error("Delete link error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
