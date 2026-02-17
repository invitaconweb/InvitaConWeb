import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createClient } from "@supabase/supabase-js";

// Use service role for webhook (no user context)
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co",
    process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder_service_role_key"
);

if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.warn("⚠️ SUPABASE_SERVICE_ROLE_KEY is missing. Using placeholder for build.");
}

export async function POST(req: NextRequest) {
    const body = await req.text();
    const sig = req.headers.get("stripe-signature");

    if (!sig) {
        return NextResponse.json({ error: "Missing signature" }, { status: 400 });
    }

    let event;
    try {
        event = stripe.webhooks.constructEvent(
            body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (err) {
        console.error("Webhook signature verification failed:", err);
        return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    if (event.type === "checkout.session.completed") {
        const session = event.data.object;
        const invitationId = session.metadata?.invitation_id;

        if (invitationId) {
            const { error } = await supabaseAdmin
                .from("invitations")
                .update({ status: "paid" })
                .eq("id", invitationId);

            if (error) {
                console.error("Error updating invitation status:", error);
                return NextResponse.json(
                    { error: "Database update failed" },
                    { status: 500 }
                );
            }

            console.log(`✅ Invitation ${invitationId} published after payment.`);
        }
    }

    return NextResponse.json({ received: true });
}
