"use server";

import { createClient } from "@/lib/supabase/server";
import type { Invitation } from "@/types";

export async function getPublicInvitation(
    slug: string
): Promise<Invitation | null> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("invitations")
        .select("*")
        .eq("slug", slug)
        .eq("status", "paid")
        .single();

    if (error || !data) {
        return null;
    }

    return data as Invitation;
}
