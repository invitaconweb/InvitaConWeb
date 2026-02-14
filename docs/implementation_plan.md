# Invitation SaaS - Implementation Plan

This document outlines the step-by-step implementation plan for the Invitation SaaS MVP. Each phase concludes with mandatory verification steps to ensure code quality and stability.

## Phase 1: Project Setup & Infrastructure
**Goal:** Initialize the Next.js project with the required stack and configuration.

- [ ] Initialize Next.js 14+ project (App Router, TypeScript, Tailwind CSS).
- [ ] Configure `shadcn/ui` and install core components (Button, Input, Card, Dialog, Toast, etc.).
- [ ] Install and configure `lucide-react` for icons.
- [ ] Set up absolute imports (`@/*`) in `tsconfig.json`.
- [ ] Configure ESLint and Prettier rules for strict TypeScript.
- [ ] Set up project folder structure (`components`, `lib`, `types`, `app`, `actions`).
- [ ] **Internationalization (i18n):** Install and configure `next-intl`.
    - [ ] Set up locales: Spanish (`es`, default), English (`en`), Basque (`eu`).
    - [ ] Create translation files structure (`messages/es.json`, etc.).
    - [ ] Configure middleware for locale detection and routing.
- [ ] Create a basic landing page layout (Header, Footer, Hero Section) with language switcher.

**Verification:**
- [ ] Run `npx tsc --noEmit` ensures no type errors.
- [ ] Run `npm run lint` ensures code style compliance.
- [ ] Run `npm run build` ensures the project builds successfully.
- [ ] Verify language switcher changes content between ES, EN, and EU.

## Phase 2: Database & Authentication (Supabase)
**Goal:** Set up the backend infrastructure and user authentication.

- [ ] Initialize Supabase project.
- [ ] Configure environment variables (`.env.local`) for Supabase URL and Anon Key.
- [ ] Implement Supabase Auth (Email/Password + Google Provider).
- [ ] Create `profiles` table and trigger to auto-create profile on signup.
- [ ] Create `templates` table and insert initial seed data (JSON structure for "Wedding" template).
- [ ] Create `invitations` table with RLS (Row Level Security) policies (Users can only read/update their own invitations).
- [ ] Create `guests` table with RLS policies.
- [ ] Create Supabase client helper (`utils/supabase/server.ts`, `client.ts`).
- [ ] Implement Auth UI (Login/Signup pages).

**Verification:**
- [ ] Verify user signup/login flow works.
- [ ] Verify RLS policies (user A cannot access user B's data).
- [ ] Run `npx tsc --noEmit`
- [ ] Run `npm run lint`
- [ ] Run `npm run build`

## Phase 3: The Editor (Core Feature)
**Goal:** Build the interface for users to create and customize their invitations based on structured templates.

- [ ] Create the Dashboard UI (List of user's invitations).
- [ ] **State Management:** Implement a store (e.g., Zustand or React Context) to manage the invitation state during editing.
- [ ] **Mobile-First Preview:** Build the preview component that renders the invitation content (iframe or isolated component).
- [ ] **Editor UI:**
    - [ ] "General Info" tab (Event Title, Date/Time, Location Link).
    - [ ] "Content" tab (Story, Message, Schedule).
    - [ ] "Design" tab (Color Palette Selector, Typography Selector).
    - [ ] "Media" tab (Image Uploader with client-side compression/preview).
    - [ ] Ensure all editor interface labels are using translation keys.
- [ ] **Save Logic:** Implement `auto-save` or "Save Changes" button that updates the `content` JSON in the `invitations` table.
- [ ] **Image Upload:** Implement drag-and-drop upload to Supabase Storage.

**Verification:**
- [ ] Verify saving changes persists to the database.
- [ ] Verify image upload works and updates the preview.
- [ ] Verify mobile preview accurately reflects the design.
- [ ] Verify the editor interface is correctly translated in all 3 languages.
- [ ] Run `npx tsc --noEmit`
- [ ] Run `npm run lint`
- [ ] Run `npm run build`

## Phase 4: Public Guest View
**Goal:** Create the high-performance, mobile-optimized page that guests will see.

- [ ] Create the public route `/[locale]/p/[slug]` (or similar) to support localized public views.
- [ ] Implement Server-Side Rendering (SSR) for the invitation data to ensure speed and SEO.
- [ ] **Open Graph:** Implement dynamic Open Graph image generation (`og:image`) using the invitation's cover photo and title.
- [ ] Render the invitation using the data from the `content` JSON.
    - [ ] **Static UI Elements:** Ensure buttons ("RSVP", "Map") are translated based on the viewer's locale.
- [ ] Implement the "Add to Calendar" button functionality.
- [ ] Implement the "Navigate" button (opens Google Maps/Waze).

**Verification:**
- [ ] Verify the page loads fast (Lighthouse score).
- [ ] Verify link previews on social media (using metatags.io or local preview).
- [ ] Run `npx tsc --noEmit`
- [ ] Run `npm run lint`
- [ ] Run `npm run build`

## Phase 5: RSVP System
**Goal:** Enable guests to confirm attendance and the host to manage these confirmations.

- [ ] **Guest Form:** Create the RSVP form component (Name, Email, Status, Diet, Msg).
    - [ ] Ensure form labels and error messages are localized.
- [ ] **Backend Logic:** Create Server Action to handle RSVP submission.
    - [ ] Validate input data.
    - [ ] Check for duplicates (optional).
    - [ ] Insert into `guests` table.
- [ ] **Host Dashboard:** Update the Dashboard to show a table/list of guests for each invitation.
- [ ] Add summary stats (Total Confirmed, Total Pending).

**Verification:**
- [ ] Verify guest submission creates a record in the database.
- [ ] Verify the host can see the new guest immediately.
- [ ] Run `npx tsc --noEmit`
- [ ] Run `npm run lint`
- [ ] Run `npm run build`

## Phase 6: Payments & Publishing
**Goal:** Monetize the service by requiring payment to publish (make the link public).

- [ ] Set up Stripe account and get API keys.
- [ ] Create a "Product" in Stripe (e.g., "Event Invitation - One Time").
- [ ] **Checkout Flow:**
    - [ ] "Publish" button in Dashboard triggers Stripe Checkout session.
    - [ ] Pass `invitation_id` and `user_id` in metadata.
- [ ] **Webhook Handler:**
    - [ ] Listen for `checkout.session.completed`.
    - [ ] Update `invitations` status from `draft` to `paid`.
    - [ ] Email receipt (handled by Stripe).
- [ ] **Access Control:** Middleware to redirect visitors if they try to access a `draft` invitation URL (unless they are the owner).

**Verification:**
- [ ] Verify Stripe Checkout flow in Test Mode.
- [ ] Verify the invitation becomes accessible to the public only *after* payment.
- [ ] Run `npx tsc --noEmit`
- [ ] Run `npm run lint`
- [ ] Run `npm run build`

## Phase 7: Launch Polish & Optimization
**Goal:** Prepare for production release.

- [ ] **SEO:** Add `robots.txt`, `sitemap.xml`, and structured data (Schema.org) for the landing page.
- [ ] **Analytics:** Integrate Vercel Analytics or PostHog (optional).
- [ ] **Error Handling:** Add global error boundaries and strict form validation (Zod).
- [ ] **Performance:** optimize images (next/image), lazy load heavy components.
- [ ] **Final Manual QA:** Go through the entire flow (Sign up -> Create -> Pay -> Share -> RSVP) as a user.

**Verification:**
- [ ] Run full test suite (if any).
- [ ] Run `npx tsc --noEmit`
- [ ] Run `npm run lint`
- [ ] Run `npm run build`
