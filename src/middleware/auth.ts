import { NextRequest } from "next/server";
import { getAdminSupabase } from "@/lib/server/supabase";

export async function authMiddleware(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return null;
    }

    const token = authHeader.slice(7);

    // Verify token with Supabase using admin client
    const supabase = getAdminSupabase();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);

    if (error || !user) {
      console.warn("Token verification failed:", error?.message);
      return null;
    }

    return user;
  } catch (error) {
    console.error("Auth middleware error:", error);
    return null;
  }
}
