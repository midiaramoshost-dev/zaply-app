import { createServerFn } from "@tanstack/react-start";

import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export type PlatformUser = {
  id: string;
  full_name: string | null;
  email: string | null;
  approved: boolean;
  requested_plan: string | null;
  created_at: string;
  last_sign_in_at: string | null;
  confirmed: boolean;
  role: "admin" | "user";
  credits: number;
};

/**
 * Lista todos os usuários cadastrados na plataforma (inclusive os que ainda não
 * têm linha em `profiles`), criando o perfil faltante quando necessário.
 * Só um administrador master pode chamar.
 */
export const listPlatformUsers = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<PlatformUser[]> => {
    const { data: isAdmin, error: roleError } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    if (roleError || !isAdmin) {
      throw new Response("Forbidden", { status: 403 });
    }

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // auth.users (fonte da verdade dos cadastros)
    const authUsers: {
      id: string;
      email: string | null;
      created_at: string;
      last_sign_in_at: string | null;
      confirmed: boolean;
      full_name: string | null;
    }[] = [];
    for (let page = 1; page <= 20; page++) {
      const { data, error } = await supabaseAdmin.auth.admin.listUsers({ page, perPage: 200 });
      if (error) throw new Error(error.message);
      for (const u of data.users) {
        authUsers.push({
          id: u.id,
          email: u.email ?? null,
          created_at: u.created_at,
          last_sign_in_at: u.last_sign_in_at ?? null,
          confirmed: Boolean(u.email_confirmed_at ?? u.confirmed_at),
          full_name: (u.user_metadata?.full_name as string | undefined) ?? null,
        });
      }
      if (data.users.length < 200) break;
    }

    const [{ data: profiles }, { data: roles }, { data: credits, error: creditsError }] = await Promise.all([
      supabaseAdmin.from("profiles").select("id, full_name, email, approved, requested_plan, created_at"),
      supabaseAdmin.from("user_roles").select("user_id, role"),
      supabaseAdmin.from("user_credits").select("user_id, balance"),
    ]);
    if (creditsError) throw new Error(creditsError.message);

    const profileMap = new Map((profiles ?? []).map((p) => [p.id, p]));

    // Backfill: cadastros sem perfil (ex.: criados antes do trigger)
    const missing = authUsers.filter((u) => !profileMap.has(u.id));
    if (missing.length) {
      await supabaseAdmin.from("profiles").upsert(
        missing.map((u) => ({
          id: u.id,
          email: u.email,
          full_name: u.full_name,
          approved: false,
        })),
        { onConflict: "id" },
      );
    }

    const roleMap = new Map<string, "admin" | "user">();
    for (const r of roles ?? []) {
      if (r.role === "admin") roleMap.set(r.user_id, "admin");
      else if (!roleMap.has(r.user_id)) roleMap.set(r.user_id, "user");
    }
    const creditMap = new Map((credits ?? []).map((row) => [row.user_id, Number(row.balance)]));

    return authUsers
      .map((u) => {
        const p = profileMap.get(u.id);
        return {
          id: u.id,
          full_name: p?.full_name ?? u.full_name,
          email: p?.email ?? u.email,
          approved: Boolean(p?.approved),
          requested_plan: p?.requested_plan ?? null,
          created_at: p?.created_at ?? u.created_at,
          last_sign_in_at: u.last_sign_in_at,
          confirmed: u.confirmed,
          role: roleMap.get(u.id) ?? "user",
          credits: creditMap.get(u.id) ?? 0,
        };
      })
      .sort((a, b) => (a.created_at < b.created_at ? 1 : -1));
  });
