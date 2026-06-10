"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getRoleHome } from "@/lib/auth/session";
import { ensureUserProfile } from "@/lib/auth/ensure-profile";
import {
  getEmailConfirmRedirectUrl,
  getPasswordResetRedirectUrl,
} from "@/lib/auth/site-url";
import type { UserRole } from "@/lib/types/database";

export async function signIn(email: string, password: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password,
  });

  if (error) return { error: error.message };

  let profile = (
    await supabase
      .from("profiles")
      .select("role, is_active")
      .eq("id", data.user.id)
      .maybeSingle()
  ).data;

  if (!profile) {
    profile = await ensureUserProfile(
      data.user.id,
      data.user.email,
      data.user.user_metadata?.full_name
    );
  }

  if (!profile) {
    await supabase.auth.signOut();
    return {
      error:
        "Account profile not found. Run supabase/migrations/20250524000000_initial_platform.sql in the Supabase SQL editor, then try again.",
    };
  }

  if (!profile.is_active) {
    await supabase.auth.signOut();
    return { error: "Your account has been deactivated." };
  }

  const home = getRoleHome((profile.role as UserRole) ?? "user");
  redirect(home);
}

export async function signUp(
  email: string,
  password: string,
  fullName: string,
  role: UserRole = "user"
) {
  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email: email.trim(),
    password,
    options: {
      data: { full_name: fullName },
      emailRedirectTo: await getEmailConfirmRedirectUrl(),
    },
  });

  if (error) return { error: error.message };

  // Profile created by trigger with role 'user'
  if (role !== "user") {
    return {
      success: true,
      message: "Account created. Ask an admin to upgrade your role.",
    };
  }

  return { success: true, message: "Check your email to confirm your account." };
}

export async function requestPasswordReset(email: string) {
  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
    redirectTo: await getPasswordResetRedirectUrl(),
  });

  if (error) return { error: error.message };
  return { success: true };
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
