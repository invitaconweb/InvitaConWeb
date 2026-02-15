"use client";

import { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    ArrowLeft,
    Save,
    Loader2,
    Eye,
    FileText,
    Palette,
    ImageIcon,
    Settings,
} from "lucide-react";
import type { Invitation } from "@/types";
import { useEditorStore } from "@/lib/store/editor-store";
import { updateInvitationContent } from "@/actions/invitations";
import { GeneralTab } from "./tabs/general-tab";
import { ContentTab } from "./tabs/content-tab";
import { DesignTab } from "./tabs/design-tab";
import { MediaTab } from "./tabs/media-tab";
import { InvitationPreview } from "./preview";
import { Link } from "@/i18n/navigation";

interface EditorTranslations {
    save: string;
    saving: string;
    saved: string;
    unsaved: string;
    back: string;
    preview: string;
    tabs: {
        general: string;
        content: string;
        design: string;
        media: string;
    };
    general: Record<string, string>;
    contentTab: Record<string, string>;
    designTab: Record<string, string>;
    mediaTab: Record<string, string>;
}

interface EditorShellProps {
    invitation: Invitation;
    translations: EditorTranslations;
}

export function EditorShell({ invitation, translations: t }: EditorShellProps) {
    const router = useRouter();
    const {
        content,
        isDirty,
        isSaving,
        activeTab,
        setInvitationId,
        setContent,
        setActiveTab,
        setIsSaving,
        markClean,
    } = useEditorStore();

    // Initialize store with invitation data
    useEffect(() => {
        setInvitationId(invitation.id);
        setContent(invitation.content);
    }, [invitation.id, invitation.content, setInvitationId, setContent]);

    const handleSave = useCallback(async () => {
        if (!isDirty || isSaving) return;
        setIsSaving(true);
        await updateInvitationContent(invitation.id, content);
        markClean();
        setIsSaving(false);
    }, [isDirty, isSaving, content, invitation.id, setIsSaving, markClean]);

    return (
        <div className="flex h-screen flex-col bg-background">
            {/* Editor Toolbar */}
            <header className="flex h-14 items-center justify-between border-b px-4">
                <div className="flex items-center gap-3">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/dashboard">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-sm font-semibold">{invitation.title}</h1>
                        <Badge variant={isDirty ? "destructive" : "secondary"} className="text-[10px]">
                            {isDirty ? t.unsaved : t.saved}
                        </Badge>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                            router.push(`/p/${invitation.slug}`)
                        }
                    >
                        <Eye className="mr-1 h-3 w-3" />
                        {t.preview}
                    </Button>
                    <Button size="sm" onClick={handleSave} disabled={!isDirty || isSaving}>
                        {isSaving ? (
                            <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                        ) : (
                            <Save className="mr-1 h-3 w-3" />
                        )}
                        {isSaving ? t.saving : t.save}
                    </Button>
                </div>
            </header>

            {/* Editor Body */}
            <div className="flex flex-1 overflow-hidden">
                {/* Tabs Panel (Left Side) */}
                <div className="w-full overflow-y-auto border-r md:w-[420px]">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
                        <TabsList className="w-full justify-start rounded-none border-b bg-transparent px-2">
                            <TabsTrigger value="general" className="gap-1 text-xs">
                                <Settings className="h-3 w-3" />
                                <span className="hidden sm:inline">{t.tabs.general}</span>
                            </TabsTrigger>
                            <TabsTrigger value="content" className="gap-1 text-xs">
                                <FileText className="h-3 w-3" />
                                <span className="hidden sm:inline">{t.tabs.content}</span>
                            </TabsTrigger>
                            <TabsTrigger value="design" className="gap-1 text-xs">
                                <Palette className="h-3 w-3" />
                                <span className="hidden sm:inline">{t.tabs.design}</span>
                            </TabsTrigger>
                            <TabsTrigger value="media" className="gap-1 text-xs">
                                <ImageIcon className="h-3 w-3" />
                                <span className="hidden sm:inline">{t.tabs.media}</span>
                            </TabsTrigger>
                        </TabsList>

                        <div className="p-4">
                            <TabsContent value="general" className="mt-0">
                                <GeneralTab translations={t.general} />
                            </TabsContent>
                            <TabsContent value="content" className="mt-0">
                                <ContentTab translations={t.contentTab} />
                            </TabsContent>
                            <TabsContent value="design" className="mt-0">
                                <DesignTab translations={t.designTab} />
                            </TabsContent>
                            <TabsContent value="media" className="mt-0">
                                <MediaTab translations={t.mediaTab} invitationId={invitation.id} />
                            </TabsContent>
                        </div>
                    </Tabs>
                </div>

                {/* Preview Panel (Right Side) - Hidden on mobile */}
                <div className="hidden flex-1 overflow-y-auto bg-muted/50 p-6 md:block">
                    <div className="mx-auto max-w-[375px]">
                        <InvitationPreview content={content} />
                    </div>
                </div>
            </div>
        </div>
    );
}
