"use client";

import type { Invitation } from "@/types";
import {
    MapPin,
    Clock,
    Heart,
    Calendar,
    Navigation,
    CalendarPlus,
    ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";

interface PublicInvitationProps {
    invitation: Invitation;
    translations: {
        rsvpButton: string;
        addToCalendar: string;
        navigate: string;
        ceremony: string;
        reception: string;
        viewOnMap: string;
        poweredBy: string;
        gallery: string;
    };
}

export function PublicInvitation({
    invitation,
    translations: t,
}: PublicInvitationProps) {
    const { sections, design } = invitation.content;
    const accentColor = design.accentColor || "#be185d";

    function handleAddToCalendar() {
        const { hero, details } = sections;
        const startDate = hero.date
            ? new Date(hero.date).toISOString().replace(/[-:]/g, "").split(".")[0] + "Z"
            : "";
        const endDate = startDate; // Same day

        const calUrl = new URL("https://calendar.google.com/calendar/render");
        calUrl.searchParams.set("action", "TEMPLATE");
        calUrl.searchParams.set("text", hero.title);
        calUrl.searchParams.set("dates", `${startDate}/${endDate}`);
        calUrl.searchParams.set(
            "location",
            details.ceremony.location || details.reception.location || ""
        );
        calUrl.searchParams.set("details", hero.subtitle || "");

        window.open(calUrl.toString(), "_blank");
    }

    function handleNavigate(mapUrl: string) {
        if (mapUrl) {
            window.open(mapUrl, "_blank");
        }
    }

    return (
        <div className="min-h-screen bg-white" style={{ fontFamily: design.fontFamily || "serif" }}>
            {/* Hero */}
            <section
                className="relative flex min-h-[70vh] flex-col items-center justify-center px-6 py-20 text-center text-white"
                style={{
                    background: sections.hero.coverImage
                        ? `linear-gradient(rgba(0,0,0,0.35), rgba(0,0,0,0.5)), url(${sections.hero.coverImage}) center/cover no-repeat`
                        : `linear-gradient(135deg, ${accentColor}, ${accentColor}cc)`,
                }}
            >
                <h1 className="mb-3 text-4xl font-bold leading-tight drop-shadow-lg md:text-5xl">
                    {sections.hero.title}
                </h1>
                <p className="mb-6 text-lg opacity-90 drop-shadow-md md:text-xl">
                    {sections.hero.subtitle}
                </p>
                {sections.hero.date && (
                    <div className="flex items-center gap-2 rounded-full bg-white/20 px-6 py-2 text-sm font-medium backdrop-blur-sm">
                        <Calendar className="h-4 w-4" />
                        {new Date(sections.hero.date).toLocaleDateString("es-ES", {
                            weekday: "long",
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                        })}
                    </div>
                )}

                {/* Action buttons */}
                <div className="mt-8 flex flex-wrap justify-center gap-3">
                    <Button
                        onClick={handleAddToCalendar}
                        variant="outline"
                        className="border-white/30 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20"
                    >
                        <CalendarPlus className="mr-2 h-4 w-4" />
                        {t.addToCalendar}
                    </Button>
                </div>
            </section>

            {/* Story */}
            {(sections.story.title || sections.story.text) && (
                <section className="mx-auto max-w-lg px-6 py-12 text-center">
                    <Heart className="mx-auto mb-4 h-6 w-6" style={{ color: accentColor }} />
                    <h2
                        className="mb-4 text-2xl font-semibold"
                        style={{ color: accentColor }}
                    >
                        {sections.story.title}
                    </h2>
                    <p className="whitespace-pre-line leading-relaxed text-gray-600">
                        {sections.story.text}
                    </p>
                </section>
            )}

            {/* Event Details */}
            <section className="bg-gray-50 px-6 py-12">
                <div className="mx-auto max-w-lg space-y-6">
                    {/* Ceremony */}
                    {sections.details.ceremony.location && (
                        <div className="rounded-2xl bg-white p-6 shadow-sm">
                            <h3
                                className="mb-3 text-lg font-semibold"
                                style={{ color: accentColor }}
                            >
                                {sections.details.ceremony.title || t.ceremony}
                            </h3>
                            <div className="space-y-2 text-sm text-gray-600">
                                {sections.details.ceremony.time && (
                                    <div className="flex items-center gap-3">
                                        <Clock className="h-4 w-4 flex-shrink-0" style={{ color: accentColor }} />
                                        <span>{sections.details.ceremony.time}</span>
                                    </div>
                                )}
                                <div className="flex items-center gap-3">
                                    <MapPin className="h-4 w-4 flex-shrink-0" style={{ color: accentColor }} />
                                    <span>{sections.details.ceremony.location}</span>
                                </div>
                            </div>
                            {sections.details.ceremony.mapUrl && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="mt-4 w-full"
                                    onClick={() =>
                                        handleNavigate(sections.details.ceremony.mapUrl)
                                    }
                                >
                                    <Navigation className="mr-2 h-3 w-3" />
                                    {t.navigate}
                                </Button>
                            )}
                        </div>
                    )}

                    {/* Reception */}
                    {sections.details.reception.location && (
                        <div className="rounded-2xl bg-white p-6 shadow-sm">
                            <h3
                                className="mb-3 text-lg font-semibold"
                                style={{ color: accentColor }}
                            >
                                {sections.details.reception.title || t.reception}
                            </h3>
                            <div className="space-y-2 text-sm text-gray-600">
                                {sections.details.reception.time && (
                                    <div className="flex items-center gap-3">
                                        <Clock className="h-4 w-4 flex-shrink-0" style={{ color: accentColor }} />
                                        <span>{sections.details.reception.time}</span>
                                    </div>
                                )}
                                <div className="flex items-center gap-3">
                                    <MapPin className="h-4 w-4 flex-shrink-0" style={{ color: accentColor }} />
                                    <span>{sections.details.reception.location}</span>
                                </div>
                            </div>
                            {sections.details.reception.mapUrl && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="mt-4 w-full"
                                    onClick={() =>
                                        handleNavigate(sections.details.reception.mapUrl)
                                    }
                                >
                                    <Navigation className="mr-2 h-3 w-3" />
                                    {t.navigate}
                                </Button>
                            )}
                        </div>
                    )}
                </div>
            </section>

            {/* Gallery */}
            {sections.gallery.images.length > 0 && (
                <section className="px-6 py-12">
                    <h2
                        className="mb-6 text-center text-xl font-semibold"
                        style={{ color: accentColor }}
                    >
                        {t.gallery}
                    </h2>
                    <div className="mx-auto grid max-w-lg grid-cols-2 gap-2">
                        {sections.gallery.images.map((url, i) => (
                            <img
                                key={i}
                                src={url}
                                alt={`Photo ${i + 1}`}
                                className="aspect-square w-full rounded-lg object-cover"
                            />
                        ))}
                    </div>
                </section>
            )}

            {/* RSVP CTA */}
            {sections.rsvp.enabled && (
                <section className="px-6 py-12 text-center">
                    <Button
                        size="lg"
                        className="rounded-full px-10 py-6 text-base font-semibold shadow-lg transition-transform hover:scale-105"
                        style={{ backgroundColor: accentColor }}
                        asChild
                    >
                        <Link href={`/p/${invitation.slug}/rsvp`}>
                            <ExternalLink className="mr-2 h-4 w-4" />
                            {t.rsvpButton}
                        </Link>
                    </Button>
                </section>
            )}

            {/* Footer */}
            <footer className="border-t bg-gray-50 px-6 py-6 text-center text-xs text-gray-400">
                {t.poweredBy}{" "}
                <Link href="/" className="font-medium underline" style={{ color: accentColor }}>
                    InvitaCon
                </Link>
            </footer>
        </div>
    );
}
