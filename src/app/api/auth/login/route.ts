import { NextRequest, NextResponse } from "next/server";
import { LoginRequest, ErrorResponse } from "@/shared/api";
import { supabase } from "@/lib/server/supabase";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as LoginRequest;
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        {
          message: "Email and password are required",
          code: "INVALID_REQUEST",
        } as ErrorResponse,
        { status: 400 }
      );
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Supabase auth error:", error);
      return NextResponse.json(
        {
          message: error.message,
          code: "AUTH_ERROR",
        } as ErrorResponse,
        { status: 401 }
      );
    }

    if (!data.user || !data.session) {
      return NextResponse.json(
        {
          message: "Failed to log in",
          code: "AUTH_ERROR",
        } as ErrorResponse,
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        user: data.user,
        token: data.session?.access_token,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      {
        message: "Internal server error",
        code: "INTERNAL_ERROR",
      } as ErrorResponse,
      { status: 500 }
    );
  }
}
