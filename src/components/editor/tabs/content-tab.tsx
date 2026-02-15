"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { useEditorStore } from "@/lib/store/editor-store";

interface ContentTabProps {
    translations: Record<string, string>;
}

export function ContentTab({ translations: t }: ContentTabProps) {
    const { content, updateStory, updateRsvp } = useEditorStore();
    const { story, rsvp } = content.sections;

    return (
        <div className="space-y-6">
            {/* Story */}
            <div className="space-y-3">
                <div className="space-y-1.5">
                    <Label htmlFor="storyTitle">{t.storyTitle}</Label>
                    <Input
                        id="storyTitle"
                        value={story.title}
                        onChange={(e) => updateStory({ title: e.target.value })}
                        placeholder={t.storyTitlePlaceholder}
                    />
                </div>
                <div className="space-y-1.5">
                    <Label htmlFor="storyText">{t.storyText}</Label>
                    <Textarea
                        id="storyText"
                        rows={5}
                        value={story.text}
                        onChange={(e) => updateStory({ text: e.target.value })}
                        placeholder={t.storyTextPlaceholder}
                    />
                </div>
            </div>

            <Separator />

            {/* RSVP Settings */}
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <Label htmlFor="rsvpEnabled">{t.rsvpEnabled}</Label>
                    <input
                        id="rsvpEnabled"
                        type="checkbox"
                        checked={rsvp.enabled}
                        onChange={(e) => updateRsvp({ enabled: e.target.checked })}
                        className="h-4 w-4 rounded"
                    />
                </div>

                {rsvp.enabled && (
                    <>
                        <div className="space-y-1.5">
                            <Label htmlFor="rsvpDeadline">{t.rsvpDeadline}</Label>
                            <Input
                                id="rsvpDeadline"
                                type="date"
                                value={rsvp.deadline}
                                onChange={(e) => updateRsvp({ deadline: e.target.value })}
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <Label htmlFor="rsvpPlusOnes">{t.rsvpPlusOnes}</Label>
                            <input
                                id="rsvpPlusOnes"
                                type="checkbox"
                                checked={rsvp.allowPlusOnes}
                                onChange={(e) =>
                                    updateRsvp({ allowPlusOnes: e.target.checked })
                                }
                                className="h-4 w-4 rounded"
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <Label htmlFor="rsvpDietary">{t.rsvpDietary}</Label>
                            <input
                                id="rsvpDietary"
                                type="checkbox"
                                checked={rsvp.askDietary}
                                onChange={(e) =>
                                    updateRsvp({ askDietary: e.target.checked })
                                }
                                className="h-4 w-4 rounded"
                            />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
