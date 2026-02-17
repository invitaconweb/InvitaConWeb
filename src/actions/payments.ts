"use server";

import { createClient } from "@/lib/supabase/server";
import { stripe } from "@/lib/stripe";
import { redirect } from "next/navigation";

const PRICE_AMOUNT = 999; // €9.99 in cents

export async function createCheckoutSession(
    invitationId: string,
    locale: string
): Promise<void> {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect(`/${locale}/auth/login`);
    }

    // Verify ownership
    const { data: invitation } = await supabase
        .from("invitations")
        .select("id, title, status, user_id")
        .eq("id", invitationId)
        .single();

    if (!invitation || invitation.user_id !== user.id) {
        redirect(`/${locale}/dashboard`);
    }

    if (invitation.status === "paid") {
        redirect(`/${locale}/dashboard`);
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3002";

    const session = await stripe.checkout.sessions.create({
        mode: "payment",
        payment_method_types: ["card"],
        line_items: [
            {
                price_data: {
                    currency: "eur",
                    product_data: {
                        name: `InvitaCon — ${invitation.title}`,
                        description: "Publicar invitación digital",
                    },
                    unit_amount: PRICE_AMOUNT,
                },
                quantity: 1,
            },
        ],
        metadata: {
            invitation_id: invitationId,
            user_id: user.id,
        },
        success_url: `${baseUrl}/${locale}/dashboard?payment=success`,
        cancel_url: `${baseUrl}/${locale}/dashboard?payment=cancelled`,
    });

    if (session.url) {
        redirect(session.url);
    }
}
