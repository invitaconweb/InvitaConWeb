import { create } from "zustand";
import type { InvitationContent, InvitationDesign, HeroSection, StorySection, DetailsSection, RsvpSection } from "@/types";
import { DEFAULT_INVITATION_CONTENT } from "@/types";

interface EditorState {
    invitationId: string | null;
    content: InvitationContent;
    isDirty: boolean;
    isSaving: boolean;
    activeTab: string;

    // Actions
    setInvitationId: (id: string) => void;
    setContent: (content: InvitationContent) => void;
    setActiveTab: (tab: string) => void;
    setIsSaving: (saving: boolean) => void;
    markClean: () => void;

    // Section updaters
    updateHero: (hero: Partial<HeroSection>) => void;
    updateStory: (story: Partial<StorySection>) => void;
    updateDetails: (details: Partial<DetailsSection>) => void;
    updateRsvp: (rsvp: Partial<RsvpSection>) => void;
    updateDesign: (design: Partial<InvitationDesign>) => void;
    addGalleryImage: (url: string) => void;
    removeGalleryImage: (index: number) => void;
}

export const useEditorStore = create<EditorState>((set) => ({
    invitationId: null,
    content: DEFAULT_INVITATION_CONTENT,
    isDirty: false,
    isSaving: false,
    activeTab: "general",

    setInvitationId: (id) => set({ invitationId: id }),
    setContent: (content) => set({ content, isDirty: false }),
    setActiveTab: (tab) => set({ activeTab: tab }),
    setIsSaving: (saving) => set({ isSaving: saving }),
    markClean: () => set({ isDirty: false }),

    updateHero: (hero) =>
        set((state) => ({
            isDirty: true,
            content: {
                ...state.content,
                sections: {
                    ...state.content.sections,
                    hero: { ...state.content.sections.hero, ...hero },
                },
            },
        })),

    updateStory: (story) =>
        set((state) => ({
            isDirty: true,
            content: {
                ...state.content,
                sections: {
                    ...state.content.sections,
                    story: { ...state.content.sections.story, ...story },
                },
            },
        })),

    updateDetails: (details) =>
        set((state) => ({
            isDirty: true,
            content: {
                ...state.content,
                sections: {
                    ...state.content.sections,
                    details: { ...state.content.sections.details, ...details },
                },
            },
        })),

    updateRsvp: (rsvp) =>
        set((state) => ({
            isDirty: true,
            content: {
                ...state.content,
                sections: {
                    ...state.content.sections,
                    rsvp: { ...state.content.sections.rsvp, ...rsvp },
                },
            },
        })),

    updateDesign: (design) =>
        set((state) => ({
            isDirty: true,
            content: {
                ...state.content,
                design: { ...state.content.design, ...design },
            },
        })),

    addGalleryImage: (url) =>
        set((state) => ({
            isDirty: true,
            content: {
                ...state.content,
                sections: {
                    ...state.content.sections,
                    gallery: {
                        images: [...state.content.sections.gallery.images, url],
                    },
                },
            },
        })),

    removeGalleryImage: (index) =>
        set((state) => ({
            isDirty: true,
            content: {
                ...state.content,
                sections: {
                    ...state.content.sections,
                    gallery: {
                        images: state.content.sections.gallery.images.filter(
                            (_, i) => i !== index
                        ),
                    },
                },
            },
        })),
}));
