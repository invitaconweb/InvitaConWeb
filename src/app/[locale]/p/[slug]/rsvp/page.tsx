import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { getPublicInvitation } from "@/actions/public";
import { RsvpForm } from "@/components/public/rsvp-form";

interface PageProps {
    params: Promise<{ locale: string; slug: string }>;
}

export default async function RsvpPage({ params }: PageProps) {
    const { locale, slug } = await params;
    setRequestLocale(locale);

    const invitation = await getPublicInvitation(slug);

    if (!invitation || !invitation.content.sections.rsvp.enabled) {
        notFound();
    }

    const t = await getTranslations("rsvp");

    return (
        <div className="min-h-screen bg-gray-50">
            <RsvpForm
                invitationId={invitation.id}
                invitationTitle={invitation.content.sections.hero.title}
                accentColor={invitation.content.design.accentColor || "#be185d"}
                askDietary={invitation.content.sections.rsvp.askDietary}
                allowPlusOnes={invitation.content.sections.rsvp.allowPlusOnes}
                translations={{
                    title: t("title"),
                    subtitle: t("subtitle"),
                    name: t("name"),
                    namePlaceholder: t("namePlaceholder"),
                    email: t("email"),
                    emailPlaceholder: t("emailPlaceholder"),
                    status: t("status"),
                    confirmed: t("confirmed"),
                    declined: t("declined"),
                    pending: t("pending"),
                    dietary: t("dietary"),
                    dietaryPlaceholder: t("dietaryPlaceholder"),
                    plusOnes: t("plusOnes"),
                    message: t("message"),
                    messagePlaceholder: t("messagePlaceholder"),
                    submit: t("submit"),
                    submitting: t("submitting"),
                    successTitle: t("successTitle"),
                    successMessage: t("successMessage"),
                    errorMessage: t("errorMessage"),
                    backToInvitation: t("backToInvitation"),
                    required: t("required"),
                }}
            />
        </div>
    );
}
