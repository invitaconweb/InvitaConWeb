"use server";

import { createClient } from "@/lib/supabase/server";
import { DEFAULT_INVITATION_CONTENT } from "@/types";
import type { Invitation, InvitationContent } from "@/types";
import { revalidatePath } from "next/cache";

// --- Fetch all invitations for current user ---
export async function getMyInvitations(): Promise<Invitation[]> {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) return [];

    const { data, error } = await supabase
        .from("invitations")
        .select("*")
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false });

    if (error) {
        console.error("Error fetching invitations:", error);
        return [];
    }

    return data as Invitation[];
}

// --- Fetch single invitation ---
export async function getInvitation(
    id: string
): Promise<Invitation | null> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("invitations")
        .select("*")
        .eq("id", id)
        .single();

    if (error) {
        console.error("Error fetching invitation:", error);
        return null;
    }

    return data as Invitation;
}

// --- Create new invitation ---
export async function createInvitation(
    title: string,
    templateId?: string
): Promise<{ id: string } | { error: string }> {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) return { error: "Not authenticated" };

    // If a template is provided, use its content as the base
    let content = DEFAULT_INVITATION_CONTENT;

    if (templateId) {
        const { data: template } = await supabase
            .from("templates")
            .select("content")
            .eq("id", templateId)
            .single();

        if (template?.content) {
            content = template.content as InvitationContent;
        }
    }

    const slug = generateSlug(title);

    const { data, error } = await supabase
        .from("invitations")
        .insert({
            user_id: user.id,
            template_id: templateId || null,
            title,
            slug,
            content,
            status: "draft",
            version: 1,
        })
        .select("id")
        .single();

    if (error) {
        console.error("Error creating invitation:", error);
        return { error: error.message };
    }

    revalidatePath("/dashboard");
    return { id: data.id };
}

// --- Update invitation content ---
export async function updateInvitationContent(
    id: string,
    content: InvitationContent
): Promise<{ success: boolean } | { error: string }> {
    const supabase = await createClient();

    const { error } = await supabase
        .from("invitations")
        .update({
            content,
            updated_at: new Date().toISOString(),
        })
        .eq("id", id);

    if (error) {
        console.error("Error updating invitation:", error);
        return { error: error.message };
    }

    return { success: true };
}

// --- Update invitation title ---
export async function updateInvitationTitle(
    id: string,
    title: string
): Promise<{ success: boolean } | { error: string }> {
    const supabase = await createClient();
    const slug = generateSlug(title);

    const { error } = await supabase
        .from("invitations")
        .update({
            title,
            slug,
            updated_at: new Date().toISOString(),
        })
        .eq("id", id);

    if (error) {
        console.error("Error updating title:", error);
        return { error: error.message };
    }

    revalidatePath("/dashboard");
    return { success: true };
}

// --- Delete invitation ---
export async function deleteInvitation(
    id: string
): Promise<{ success: boolean } | { error: string }> {
    const supabase = await createClient();

    const { error } = await supabase
        .from("invitations")
        .delete()
        .eq("id", id);

    if (error) {
        console.error("Error deleting invitation:", error);
        return { error: error.message };
    }

    revalidatePath("/dashboard");
    return { success: true };
}

// --- Helpers ---

function generateSlug(title: string): string {
    return title
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // Remove accents
        .replace(/[^a-z0-9]+/g, "-") // Replace non-alphanumeric with hyphens
        .replace(/^-+|-+$/g, "") // Trim hyphens
        .substring(0, 60)
        + "-" + Math.random().toString(36).substring(2, 7); // Add random suffix for uniqueness
}
