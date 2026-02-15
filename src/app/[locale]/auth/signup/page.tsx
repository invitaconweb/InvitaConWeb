import { setRequestLocale } from "next-intl/server";
import { SignupForm } from "@/components/auth/signup-form";

interface PageProps {
    params: Promise<{ locale: string }>;
}

export default async function SignupPage({ params }: PageProps) {
    const { locale } = await params;
    setRequestLocale(locale);

    return <SignupForm />;
}
