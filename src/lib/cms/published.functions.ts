import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

export type PublishedMap = Record<string, Record<string, unknown>>;

/** Public, read-only: returns only PUBLISHED content (drafts live in a separate admin-only table). */
export const getPublishedContent = createServerFn({ method: "GET" }).handler(async (): Promise<PublishedMap> => {
  const url = process.env["SUPABASE_URL"];
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"] ?? process.env["SUPABASE_ANON_KEY"];
  if (!url || !key) return {};
  const sb = createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false, storage: undefined },
    global: {
      fetch: (input, init) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) h.delete("Authorization");
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });
  const { data, error } = await sb.from("site_content").select("page_key, content");
  if (error) {
    console.error("[cms] published fetch failed", error.message);
    return {};
  }
  const out: PublishedMap = {};
  for (const row of data ?? []) out[row.page_key] = (row.content ?? {}) as Record<string, unknown>;
  return out;
});
