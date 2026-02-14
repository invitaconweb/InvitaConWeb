// Application-wide TypeScript type definitions
// This file will be expanded as we add more features

export interface SiteConfig {
    name: string;
    description: string;
    url: string;
    ogImage: string;
}

export type Locale = "es" | "en" | "eu";
