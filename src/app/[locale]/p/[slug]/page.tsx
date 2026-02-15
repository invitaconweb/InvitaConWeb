import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { getPublicInvitation } from "@/actions/public";
import { PublicInvitation } from "@/components/public/public-invitation";
import type { Metadata } from "next";

interface PageProps {
    params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({
    params,
}: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const invitation = await getPublicInvitation(slug);

    if (!invitation) {
        return { title: "InvitaCon" };
    }

    const { hero } = invitation.content.sections;
    const description = hero.subtitle || "Estás invitado/a";

    return {
        title: `${hero.title} | InvitaCon`,
        description,
        openGraph: {
            title: hero.title,
            description,
            type: "website",
            images: hero.coverImage
                ? [{ url: hero.coverImage, width: 1200, height: 630 }]
                : [],
        },
        twitter: {
            card: "summary_large_image",
            title: hero.title,
            description,
            images: hero.coverImage ? [hero.coverImage] : [],
        },
    };
}

export default async function PublicPage({ params }: PageProps) {
    const { locale, slug } = await params;
    setRequestLocale(locale);

    const invitation = await getPublicInvitation(slug);

    if (!invitation) {
        notFound();
    }

    const t = await getTranslations("publicView");

    return (
        <PublicInvitation
            invitation={invitation}
            translations={{
                rsvpButton: t("rsvpButton"),
                addToCalendar: t("addToCalendar"),
                navigate: t("navigate"),
                ceremony: t("ceremony"),
                reception: t("reception"),
                viewOnMap: t("viewOnMap"),
                poweredBy: t("poweredBy"),
                gallery: t("gallery"),
            }}
        />
    );
}
