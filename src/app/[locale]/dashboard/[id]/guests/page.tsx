import { redirect } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { getInvitation } from "@/actions/invitations";
import { getInvitationGuests, getGuestStats } from "@/actions/rsvp";
import { GuestList } from "@/components/dashboard/guest-list";

interface PageProps {
    params: Promise<{ locale: string; id: string }>;
}

export default async function GuestsPage({ params }: PageProps) {
    const { locale, id } = await params;
    setRequestLocale(locale);

    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect(`/${locale}/auth/login`);
    }

    const invitation = await getInvitation(id);

    if (!invitation || invitation.user_id !== user.id) {
        redirect(`/${locale}/dashboard`);
    }

    const [guests, stats] = await Promise.all([
        getInvitationGuests(id),
        getGuestStats(id),
    ]);

    const t = await getTranslations("guests");

    return (
        <GuestList
            invitationId={id}
            invitationTitle={invitation.title}
            guests={guests}
            stats={stats}
            translations={{
                title: t("title"),
                backToDashboard: t("backToDashboard"),
                confirmed: t("confirmed"),
                declined: t("declined"),
                pending: t("pending"),
                totalGuests: t("totalGuests"),
                plusOnes: t("plusOnes"),
                noGuests: t("noGuests"),
                noGuestsDesc: t("noGuestsDesc"),
                name: t("name"),
                email: t("email"),
                status: t("status"),
                dietary: t("dietary"),
                message: t("message"),
                delete: t("delete"),
                confirmDelete: t("confirmDelete"),
                cancel: t("cancel"),
            }}
        />
    );
}
