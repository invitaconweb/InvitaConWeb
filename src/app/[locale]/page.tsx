import { setRequestLocale } from "next-intl/server";
import { Header } from "@/components/landing/header";
import { Hero } from "@/components/landing/hero";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Templates } from "@/components/landing/templates";
import { Pricing } from "@/components/landing/pricing";
import { Footer } from "@/components/landing/footer";

interface PageProps {
    params: Promise<{ locale: string }>;
}

export default async function HomePage({ params }: PageProps) {
    const { locale } = await params;
    setRequestLocale(locale);

    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">
                <Hero />
                <HowItWorks />
                <Templates />
                <Pricing />
            </main>
            <Footer />
        </div>
    );
}
