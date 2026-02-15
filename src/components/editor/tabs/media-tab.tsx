"use client";

import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Upload, X, ImageIcon } from "lucide-react";
import { useEditorStore } from "@/lib/store/editor-store";
import { createClient } from "@/lib/supabase/client";

interface MediaTabProps {
    translations: Record<string, string>;
    invitationId: string;
}

export function MediaTab({ translations: t, invitationId }: MediaTabProps) {
    const { content, updateHero, addGalleryImage, removeGalleryImage } =
        useEditorStore();
    const [uploading, setUploading] = useState(false);

    const uploadFile = useCallback(
        async (file: File, target: "cover" | "gallery") => {
            setUploading(true);
            try {
                const supabase = createClient();
                const ext = file.name.split(".").pop();
                const fileName = `${invitationId}/${Date.now()}-${Math.random()
                    .toString(36)
                    .substring(2)}.${ext}`;

                const { error: uploadError } = await supabase.storage
                    .from("invitations")
                    .upload(fileName, file, { upsert: true });

                if (uploadError) {
                    console.error("Upload error:", uploadError);
                    return;
                }

                const {
                    data: { publicUrl },
                } = supabase.storage.from("invitations").getPublicUrl(fileName);

                if (target === "cover") {
                    updateHero({ coverImage: publicUrl });
                } else {
                    addGalleryImage(publicUrl);
                }
            } catch (err) {
                console.error("Upload failed:", err);
            } finally {
                setUploading(false);
            }
        },
        [invitationId, updateHero, addGalleryImage]
    );

    const handleDrop = useCallback(
        (e: React.DragEvent, target: "cover" | "gallery") => {
            e.preventDefault();
            const file = e.dataTransfer.files[0];
            if (file && file.type.startsWith("image/")) {
                uploadFile(file, target);
            }
        },
        [uploadFile]
    );

    const handleFileInput = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>, target: "cover" | "gallery") => {
            const file = e.target.files?.[0];
            if (file) {
                uploadFile(file, target);
            }
        },
        [uploadFile]
    );

    return (
        <div className="space-y-6">
            {/* Cover Image */}
            <div className="space-y-3">
                <Label>{t.coverImage}</Label>
                {content.sections.hero.coverImage ? (
                    <div className="relative">
                        <img
                            src={content.sections.hero.coverImage}
                            alt="Cover"
                            className="h-40 w-full rounded-lg object-cover"
                        />
                        <Button
                            variant="destructive"
                            size="icon"
                            className="absolute right-2 top-2 h-6 w-6"
                            onClick={() => updateHero({ coverImage: "" })}
                        >
                            <X className="h-3 w-3" />
                        </Button>
                    </div>
                ) : (
                    <div
                        className="flex h-32 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors hover:border-primary/50"
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => handleDrop(e, "cover")}
                    >
                        <Upload className="mb-2 h-6 w-6 text-muted-foreground" />
                        <p className="text-xs text-muted-foreground">{t.dragDrop}</p>
                        <label className="mt-2 cursor-pointer">
                            <Button variant="outline" size="sm" asChild disabled={uploading}>
                                <span>{t.uploadImage}</span>
                            </Button>
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => handleFileInput(e, "cover")}
                            />
                        </label>
                    </div>
                )}
            </div>

            <Separator />

            {/* Gallery */}
            <div className="space-y-3">
                <Label>{t.gallery}</Label>
                <div className="grid grid-cols-3 gap-2">
                    {content.sections.gallery.images.map((url, index) => (
                        <div key={index} className="relative group">
                            <img
                                src={url}
                                alt={`Gallery ${index + 1}`}
                                className="h-20 w-full rounded-md object-cover"
                            />
                            <Button
                                variant="destructive"
                                size="icon"
                                className="absolute right-1 top-1 h-5 w-5 opacity-0 transition-opacity group-hover:opacity-100"
                                onClick={() => removeGalleryImage(index)}
                            >
                                <X className="h-3 w-3" />
                            </Button>
                        </div>
                    ))}
                    <div
                        className="flex h-20 cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed text-muted-foreground transition-colors hover:border-primary/50"
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => handleDrop(e, "gallery")}
                    >
                        <label className="flex cursor-pointer flex-col items-center">
                            <ImageIcon className="mb-1 h-5 w-5" />
                            <span className="text-[10px]">{t.uploadImage}</span>
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => handleFileInput(e, "gallery")}
                            />
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
}
