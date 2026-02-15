"use client";

import type { InvitationContent } from "@/types";
import { MapPin, Clock, Heart, Calendar } from "lucide-react";

interface InvitationPreviewProps {
    content: InvitationContent;
}

export function InvitationPreview({ content }: InvitationPreviewProps) {
    const { sections, design } = content;
    const accentColor = design.accentColor || "#be185d";

    return (
        <div
            className="overflow-hidden rounded-2xl border bg-white shadow-xl"
            style={{ fontFamily: design.fontFamily || "serif" }}
        >
            {/* Hero Section */}
            <div
                className="relative flex flex-col items-center justify-center px-6 py-16 text-center text-white"
                style={{
                    background: sections.hero.coverImage
                        ? `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.5)), url(${sections.hero.coverImage}) center/cover`
                        : `linear-gradient(135deg, ${accentColor}, ${accentColor}dd)`,
                }}
            >
                <h1 className="mb-2 text-3xl font-bold leading-tight">
                    {sections.hero.title || "Título del Evento"}
                </h1>
                <p className="mb-4 text-sm opacity-90">
                    {sections.hero.subtitle || "Subtítulo"}
                </p>
                {sections.hero.date && (
                    <div className="flex items-center gap-1.5 rounded-full bg-white/20 px-4 py-1.5 text-xs backdrop-blur">
                        <Calendar className="h-3 w-3" />
                        {new Date(sections.hero.date).toLocaleDateString("es-ES", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                        })}
                    </div>
                )}
            </div>

            {/* Story Section */}
            {(sections.story.title || sections.story.text) && (
                <div className="px-6 py-8 text-center">
                    <Heart
                        className="mx-auto mb-3 h-5 w-5"
                        style={{ color: accentColor }}
                    />
                    <h2
                        className="mb-3 text-lg font-semibold"
                        style={{ color: accentColor }}
                    >
                        {sections.story.title}
                    </h2>
                    <p className="text-sm leading-relaxed text-gray-600">
                        {sections.story.text}
                    </p>
                </div>
            )}

            {/* Details Section */}
            <div className="space-y-4 bg-gray-50 px-6 py-8">
                {sections.details.ceremony.location && (
                    <div className="rounded-xl bg-white p-4 shadow-sm">
                        <h3
                            className="mb-2 text-sm font-semibold"
                            style={{ color: accentColor }}
                        >
                            {sections.details.ceremony.title}
                        </h3>
                        <div className="space-y-1.5 text-xs text-gray-600">
                            {sections.details.ceremony.time && (
                                <div className="flex items-center gap-2">
                                    <Clock className="h-3 w-3" />
                                    {sections.details.ceremony.time}
                                </div>
                            )}
                            <div className="flex items-center gap-2">
                                <MapPin className="h-3 w-3" />
                                {sections.details.ceremony.location}
                            </div>
                        </div>
                        {sections.details.ceremony.mapUrl && (
                            <a
                                href={sections.details.ceremony.mapUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-2 inline-block text-xs font-medium underline"
                                style={{ color: accentColor }}
                            >
                                Ver en mapa →
                            </a>
                        )}
                    </div>
                )}

                {sections.details.reception.location && (
                    <div className="rounded-xl bg-white p-4 shadow-sm">
                        <h3
                            className="mb-2 text-sm font-semibold"
                            style={{ color: accentColor }}
                        >
                            {sections.details.reception.title}
                        </h3>
                        <div className="space-y-1.5 text-xs text-gray-600">
                            {sections.details.reception.time && (
                                <div className="flex items-center gap-2">
                                    <Clock className="h-3 w-3" />
                                    {sections.details.reception.time}
                                </div>
                            )}
                            <div className="flex items-center gap-2">
                                <MapPin className="h-3 w-3" />
                                {sections.details.reception.location}
                            </div>
                        </div>
                        {sections.details.reception.mapUrl && (
                            <a
                                href={sections.details.reception.mapUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-2 inline-block text-xs font-medium underline"
                                style={{ color: accentColor }}
                            >
                                Ver en mapa →
                            </a>
                        )}
                    </div>
                )}
            </div>

            {/* Gallery */}
            {sections.gallery.images.length > 0 && (
                <div className="grid grid-cols-2 gap-1 p-1">
                    {sections.gallery.images.map((url, i) => (
                        <img
                            key={i}
                            src={url}
                            alt={`Gallery ${i + 1}`}
                            className="aspect-square w-full object-cover"
                        />
                    ))}
                </div>
            )}

            {/* RSVP Button */}
            {sections.rsvp.enabled && (
                <div className="px-6 py-8 text-center">
                    <button
                        className="w-full rounded-full px-8 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                        style={{ backgroundColor: accentColor }}
                    >
                        Confirmar Asistencia (RSVP)
                    </button>
                </div>
            )}
        </div>
    );
}
