import { NextRequest, NextResponse } from "next/server";
import { SignupRequest, ErrorResponse } from "@/shared/api";
import { supabase, getAdminSupabase } from "@/lib/server/supabase";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as SignupRequest;
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

    // Sign up user with Supabase Auth
    const { data, error } = await supabase.auth.signUp({
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
        { status: 400 }
      );
    }

    if (!data.user) {
      return NextResponse.json(
        {
          message: "Failed to create user",
          code: "AUTH_ERROR",
        } as ErrorResponse,
        { status: 400 }
      );
    }

    // Create a profile for the new user
    try {
      const adminSupabase = getAdminSupabase();
      await adminSupabase.from("profiles").insert({
        user_id: data.user.id,
        username: `user_${data.user.id.slice(0, 8)}`,
        display_name: "",
        bio: "",
        avatar_url: null,
        theme_settings: null,
        custom_domain: null,
        plan: "free",
        onboarded: false,
      });
    } catch (profileError) {
      console.error("Failed to create profile:", profileError);
      // Continue anyway - profile creation is secondary
    }

    return NextResponse.json(
      {
        user: data.user,
        token: data.session?.access_token,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      {
        message: "Internal server error",
        code: "INTERNAL_ERROR",
      } as ErrorResponse,
      { status: 500 }
    );
  }
}
