"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useEditorStore } from "@/lib/store/editor-store";

interface DesignTabProps {
    translations: Record<string, string>;
}

const COLOR_PALETTES = [
    { value: "rose", label: "Rose", color: "#be185d" },
    { value: "blue", label: "Blue", color: "#1d4ed8" },
    { value: "emerald", label: "Emerald", color: "#047857" },
    { value: "amber", label: "Amber", color: "#b45309" },
    { value: "violet", label: "Violet", color: "#6d28d9" },
    { value: "slate", label: "Slate", color: "#475569" },
];

const FONT_FAMILIES = [
    { value: "Playfair Display", label: "Playfair Display" },
    { value: "Inter", label: "Inter" },
    { value: "Cormorant Garamond", label: "Cormorant Garamond" },
    { value: "Montserrat", label: "Montserrat" },
    { value: "Great Vibes", label: "Great Vibes" },
    { value: "Lora", label: "Lora" },
];

export function DesignTab({ translations: t }: DesignTabProps) {
    const { content, updateDesign } = useEditorStore();
    const { design } = content;

    return (
        <div className="space-y-6">
            {/* Color Palette */}
            <div className="space-y-3">
                <Label>{t.colorPalette}</Label>
                <div className="grid grid-cols-3 gap-2">
                    {COLOR_PALETTES.map((palette) => (
                        <button
                            key={palette.value}
                            className={`flex items-center gap-2 rounded-lg border-2 p-2.5 text-xs transition-all ${design.colorPalette === palette.value
                                    ? "border-primary bg-primary/5"
                                    : "border-transparent bg-muted/50 hover:border-muted-foreground/20"
                                }`}
                            onClick={() => {
                                updateDesign({
                                    colorPalette: palette.value,
                                    accentColor: palette.color,
                                });
                            }}
                        >
                            <div
                                className="h-4 w-4 rounded-full"
                                style={{ backgroundColor: palette.color }}
                            />
                            {palette.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Font Family */}
            <div className="space-y-1.5">
                <Label>{t.fontFamily}</Label>
                <Select
                    value={design.fontFamily}
                    onValueChange={(value) => updateDesign({ fontFamily: value })}
                >
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {FONT_FAMILIES.map((font) => (
                            <SelectItem key={font.value} value={font.value}>
                                {font.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Accent Color (custom) */}
            <div className="space-y-1.5">
                <Label htmlFor="accentColor">{t.accentColor}</Label>
                <div className="flex gap-2">
                    <Input
                        id="accentColor"
                        type="color"
                        value={design.accentColor}
                        onChange={(e) => updateDesign({ accentColor: e.target.value })}
                        className="h-10 w-14 cursor-pointer p-1"
                    />
                    <Input
                        value={design.accentColor}
                        onChange={(e) => updateDesign({ accentColor: e.target.value })}
                        className="flex-1"
                        placeholder="#be185d"
                    />
                </div>
            </div>
        </div>
    );
}
