import { redirect } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { getMyInvitations } from "@/actions/invitations";
import { DashboardContent } from "@/components/dashboard/dashboard-content";

interface PageProps {
    params: Promise<{ locale: string }>;
}

export default async function DashboardPage({ params }: PageProps) {
    const { locale } = await params;
    setRequestLocale(locale);

    // Check auth
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect(`/${locale}/auth/login`);
    }

    const invitations = await getMyInvitations();
    const t = await getTranslations("dashboard");

    return (
        <DashboardContent
            invitations={invitations}
            userName={user.user_metadata?.full_name || user.email || ""}
            translations={{
                title: t("title"),
                subtitle: t("subtitle"),
                createNew: t("createNew"),
                noInvitations: t("noInvitations"),
                noInvitationsDesc: t("noInvitationsDesc"),
                edit: t("edit"),
                delete: t("delete"),
                draft: t("draft"),
                paid: t("paid"),
                confirmDelete: t("confirmDelete"),
                guests: t("guests"),
                cancel: t("cancel"),
                signOut: t("signOut"),
            }}
        />
    );
}
