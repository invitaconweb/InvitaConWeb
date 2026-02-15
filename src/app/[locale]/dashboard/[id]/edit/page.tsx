import { redirect } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { getInvitation } from "@/actions/invitations";
import { EditorShell } from "@/components/editor/editor-shell";

interface PageProps {
    params: Promise<{ locale: string; id: string }>;
}

export default async function EditorPage({ params }: PageProps) {
    const { locale, id } = await params;
    setRequestLocale(locale);

    // Check auth
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

    const t = await getTranslations("editor");

    return (
        <EditorShell
            invitation={invitation}
            translations={{
                save: t("save"),
                saving: t("saving"),
                saved: t("saved"),
                unsaved: t("unsaved"),
                back: t("back"),
                preview: t("preview"),
                tabs: {
                    general: t("tabs.general"),
                    content: t("tabs.content"),
                    design: t("tabs.design"),
                    media: t("tabs.media"),
                },
                general: {
                    eventTitle: t("general.eventTitle"),
                    eventTitlePlaceholder: t("general.eventTitlePlaceholder"),
                    subtitle: t("general.subtitle"),
                    subtitlePlaceholder: t("general.subtitlePlaceholder"),
                    eventDate: t("general.eventDate"),
                    ceremonyTitle: t("general.ceremonyTitle"),
                    ceremonyTime: t("general.ceremonyTime"),
                    ceremonyLocation: t("general.ceremonyLocation"),
                    ceremonyMapUrl: t("general.ceremonyMapUrl"),
                    receptionTitle: t("general.receptionTitle"),
                    receptionTime: t("general.receptionTime"),
                    receptionLocation: t("general.receptionLocation"),
                    receptionMapUrl: t("general.receptionMapUrl"),
                },
                contentTab: {
                    storyTitle: t("content.storyTitle"),
                    storyTitlePlaceholder: t("content.storyTitlePlaceholder"),
                    storyText: t("content.storyText"),
                    storyTextPlaceholder: t("content.storyTextPlaceholder"),
                    rsvpEnabled: t("content.rsvpEnabled"),
                    rsvpDeadline: t("content.rsvpDeadline"),
                    rsvpPlusOnes: t("content.rsvpPlusOnes"),
                    rsvpDietary: t("content.rsvpDietary"),
                },
                designTab: {
                    colorPalette: t("design.colorPalette"),
                    fontFamily: t("design.fontFamily"),
                    accentColor: t("design.accentColor"),
                },
                mediaTab: {
                    coverImage: t("media.coverImage"),
                    gallery: t("media.gallery"),
                    uploadImage: t("media.uploadImage"),
                    removeImage: t("media.removeImage"),
                    dragDrop: t("media.dragDrop"),
                },
            }}
        />
    );
}
