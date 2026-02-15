// ============================================================
// InvitaCon - Core TypeScript Types
// ============================================================

export type Locale = "es" | "en" | "eu";

// --- Database Row Types ---

export interface Profile {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
    created_at: string;
    updated_at: string;
}

export interface Template {
    id: string;
    name: string;
    slug: string;
    category: TemplateCategory;
    description: string | null;
    thumbnail_url: string | null;
    content: InvitationContent;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface Invitation {
    id: string;
    user_id: string;
    template_id: string | null;
    title: string;
    slug: string | null;
    content: InvitationContent;
    status: InvitationStatus;
    version: number;
    og_image_url: string | null;
    event_date: string | null;
    created_at: string;
    updated_at: string;
}

export interface Guest {
    id: string;
    invitation_id: string;
    name: string;
    email: string | null;
    status: GuestStatus;
    dietary_requirements: string | null;
    plus_ones: number;
    message: string | null;
    created_at: string;
}

// --- Enums ---

export type InvitationStatus = "draft" | "paid";
export type GuestStatus = "confirmed" | "declined" | "pending";
export type TemplateCategory = "wedding" | "baptism" | "communion" | "party";

// --- Invitation Content Structure (JSON) ---

export interface InvitationContent {
    version: number;
    sections: InvitationSections;
    design: InvitationDesign;
}

export interface InvitationSections {
    hero: HeroSection;
    story: StorySection;
    details: DetailsSection;
    gallery: GallerySection;
    rsvp: RsvpSection;
}

export interface HeroSection {
    title: string;
    subtitle: string;
    date: string;
    coverImage: string;
}

export interface StorySection {
    title: string;
    text: string;
}

export interface DetailsSection {
    ceremony: EventDetail;
    reception: EventDetail;
}

export interface EventDetail {
    title: string;
    time: string;
    location: string;
    mapUrl: string;
}

export interface GallerySection {
    images: string[];
}

export interface RsvpSection {
    enabled: boolean;
    deadline: string;
    allowPlusOnes: boolean;
    askDietary: boolean;
}

export interface InvitationDesign {
    colorPalette: string;
    fontFamily: string;
    accentColor: string;
}

// --- Default Content ---

export const DEFAULT_INVITATION_CONTENT: InvitationContent = {
    version: 1,
    sections: {
        hero: {
            title: "",
            subtitle: "",
            date: "",
            coverImage: "",
        },
        story: {
            title: "",
            text: "",
        },
        details: {
            ceremony: {
                title: "Ceremonia",
                time: "",
                location: "",
                mapUrl: "",
            },
            reception: {
                title: "Celebración",
                time: "",
                location: "",
                mapUrl: "",
            },
        },
        gallery: {
            images: [],
        },
        rsvp: {
            enabled: true,
            deadline: "",
            allowPlusOnes: true,
            askDietary: true,
        },
    },
    design: {
        colorPalette: "rose",
        fontFamily: "Playfair Display",
        accentColor: "#be185d",
    },
};
