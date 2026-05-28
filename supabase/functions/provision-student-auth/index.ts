import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { student_id, issue_new } = await req.json();
    if (!student_id || typeof student_id !== "string") {
      return new Response(JSON.stringify({ error: "student_id is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { data: profile, error: profErr } = await supabase
      .from("student_profiles")
      .select("email, login_password, full_name")
      .eq("student_id", student_id)
      .maybeSingle();

    if (profErr || !profile) {
      return new Response(JSON.stringify({ error: "Student not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Admin "issue new password" flow: regenerate a fresh password, update auth,
    // persist it to student_profiles.login_password, and clear password_changed_at
    // (the student is back to the admin-issued credential).
    let password = profile.login_password as string | null;
    if (issue_new) {
      const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
      let out = "";
      const buf = new Uint8Array(8);
      crypto.getRandomValues(buf);
      for (let i = 0; i < 8; i++) out += chars[buf[i] % chars.length];
      password = out;

      const { error: upProfErr } = await supabase
        .from("student_profiles")
        .update({ login_password: password, password_changed_at: null })
        .eq("student_id", student_id);
      if (upProfErr) throw upProfErr;
    }

    if (!profile.email || !password) {
      return new Response(
        JSON.stringify({ error: "Student missing email or login_password" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Check if auth user already exists
    const { data: list } = await supabase.auth.admin.listUsers({ page: 1, perPage: 200 });
    const existing = list?.users?.find(
      (u) => u.email?.toLowerCase() === profile.email.toLowerCase(),
    );

    if (existing) {
      const { error: updErr } = await supabase.auth.admin.updateUserById(existing.id, {
        password,
        email_confirm: true,
        user_metadata: { full_name: profile.full_name, student_id },
      });
      if (updErr) throw updErr;
      return new Response(
        JSON.stringify({ status: "updated", user_id: existing.id, email: profile.email, password: issue_new ? password : undefined }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const { data: created, error: createErr } = await supabase.auth.admin.createUser({
      email: profile.email,
      password,
      email_confirm: true,
      user_metadata: { full_name: profile.full_name, student_id },
    });
    if (createErr) throw createErr;

    return new Response(
      JSON.stringify({ status: "created", user_id: created.user?.id, email: profile.email, password: issue_new ? password : undefined }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e?.message || e) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});