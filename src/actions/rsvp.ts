"use server";

import { createClient } from "@/lib/supabase/server";
import type { Guest, GuestStatus } from "@/types";

// --- Submit RSVP ---
export async function submitRsvp(data: {
    invitationId: string;
    name: string;
    email: string;
    status: GuestStatus;
    dietaryRequirements?: string;
    plusOnes?: number;
    message?: string;
}): Promise<{ success: boolean } | { error: string }> {
    const supabase = await createClient();

    // Check if this email already RSVPed for this invitation
    const { data: existing } = await supabase
        .from("guests")
        .select("id")
        .eq("invitation_id", data.invitationId)
        .eq("email", data.email)
        .maybeSingle();

    if (existing) {
        // Update existing RSVP
        const { error } = await supabase
            .from("guests")
            .update({
                name: data.name,
                status: data.status,
                dietary_requirements: data.dietaryRequirements || null,
                plus_ones: data.plusOnes || 0,
                message: data.message || null,
            })
            .eq("id", existing.id);

        if (error) {
            console.error("Error updating RSVP:", error);
            return { error: error.message };
        }

        return { success: true };
    }

    // Insert new RSVP
    const { error } = await supabase.from("guests").insert({
        invitation_id: data.invitationId,
        name: data.name,
        email: data.email,
        status: data.status,
        dietary_requirements: data.dietaryRequirements || null,
        plus_ones: data.plusOnes || 0,
        message: data.message || null,
    });

    if (error) {
        console.error("Error submitting RSVP:", error);
        return { error: error.message };
    }

    return { success: true };
}

// --- Get guests for an invitation (host view) ---
export async function getInvitationGuests(
    invitationId: string
): Promise<Guest[]> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("guests")
        .select("*")
        .eq("invitation_id", invitationId)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching guests:", error);
        return [];
    }

    return data as Guest[];
}

// --- Get guest stats ---
export async function getGuestStats(invitationId: string): Promise<{
    total: number;
    confirmed: number;
    declined: number;
    pending: number;
    totalPlusOnes: number;
}> {
    const guests = await getInvitationGuests(invitationId);

    return {
        total: guests.length,
        confirmed: guests.filter((g) => g.status === "confirmed").length,
        declined: guests.filter((g) => g.status === "declined").length,
        pending: guests.filter((g) => g.status === "pending").length,
        totalPlusOnes: guests.reduce((sum, g) => sum + g.plus_ones, 0),
    };
}

// --- Delete a guest ---
export async function deleteGuest(
    guestId: string
): Promise<{ success: boolean } | { error: string }> {
    const supabase = await createClient();

    const { error } = await supabase
        .from("guests")
        .delete()
        .eq("id", guestId);

    if (error) {
        console.error("Error deleting guest:", error);
        return { error: error.message };
    }

    return { success: true };
}
