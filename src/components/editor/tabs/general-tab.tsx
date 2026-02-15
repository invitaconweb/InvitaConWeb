"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useEditorStore } from "@/lib/store/editor-store";

interface GeneralTabProps {
    translations: Record<string, string>;
}

export function GeneralTab({ translations: t }: GeneralTabProps) {
    const { content, updateHero, updateDetails } = useEditorStore();
    const { hero, details } = content.sections;

    return (
        <div className="space-y-6">
            {/* Hero */}
            <div className="space-y-3">
                <div className="space-y-1.5">
                    <Label htmlFor="eventTitle">{t.eventTitle}</Label>
                    <Input
                        id="eventTitle"
                        value={hero.title}
                        onChange={(e) => updateHero({ title: e.target.value })}
                        placeholder={t.eventTitlePlaceholder}
                    />
                </div>
                <div className="space-y-1.5">
                    <Label htmlFor="subtitle">{t.subtitle}</Label>
                    <Input
                        id="subtitle"
                        value={hero.subtitle}
                        onChange={(e) => updateHero({ subtitle: e.target.value })}
                        placeholder={t.subtitlePlaceholder}
                    />
                </div>
                <div className="space-y-1.5">
                    <Label htmlFor="eventDate">{t.eventDate}</Label>
                    <Input
                        id="eventDate"
                        type="date"
                        value={hero.date}
                        onChange={(e) => updateHero({ date: e.target.value })}
                    />
                </div>
            </div>

            <Separator />

            {/* Ceremony */}
            <div className="space-y-3">
                <h3 className="text-sm font-semibold">{t.ceremonyTitle}</h3>
                <div className="space-y-1.5">
                    <Label htmlFor="ceremonyTime">{t.ceremonyTime}</Label>
                    <Input
                        id="ceremonyTime"
                        type="time"
                        value={details.ceremony.time}
                        onChange={(e) =>
                            updateDetails({
                                ceremony: { ...details.ceremony, time: e.target.value },
                            })
                        }
                    />
                </div>
                <div className="space-y-1.5">
                    <Label htmlFor="ceremonyLocation">{t.ceremonyLocation}</Label>
                    <Input
                        id="ceremonyLocation"
                        value={details.ceremony.location}
                        onChange={(e) =>
                            updateDetails({
                                ceremony: { ...details.ceremony, location: e.target.value },
                            })
                        }
                    />
                </div>
                <div className="space-y-1.5">
                    <Label htmlFor="ceremonyMapUrl">{t.ceremonyMapUrl}</Label>
                    <Input
                        id="ceremonyMapUrl"
                        type="url"
                        value={details.ceremony.mapUrl}
                        onChange={(e) =>
                            updateDetails({
                                ceremony: { ...details.ceremony, mapUrl: e.target.value },
                            })
                        }
                        placeholder="https://maps.google.com/..."
                    />
                </div>
            </div>

            <Separator />

            {/* Reception */}
            <div className="space-y-3">
                <h3 className="text-sm font-semibold">{t.receptionTitle}</h3>
                <div className="space-y-1.5">
                    <Label htmlFor="receptionTime">{t.receptionTime}</Label>
                    <Input
                        id="receptionTime"
                        type="time"
                        value={details.reception.time}
                        onChange={(e) =>
                            updateDetails({
                                reception: { ...details.reception, time: e.target.value },
                            })
                        }
                    />
                </div>
                <div className="space-y-1.5">
                    <Label htmlFor="receptionLocation">{t.receptionLocation}</Label>
                    <Input
                        id="receptionLocation"
                        value={details.reception.location}
                        onChange={(e) =>
                            updateDetails({
                                reception: { ...details.reception, location: e.target.value },
                            })
                        }
                    />
                </div>
                <div className="space-y-1.5">
                    <Label htmlFor="receptionMapUrl">{t.receptionMapUrl}</Label>
                    <Input
                        id="receptionMapUrl"
                        type="url"
                        value={details.reception.mapUrl}
                        onChange={(e) =>
                            updateDetails({
                                reception: { ...details.reception, mapUrl: e.target.value },
                            })
                        }
                        placeholder="https://maps.google.com/..."
                    />
                </div>
            </div>
        </div>
    );
}
