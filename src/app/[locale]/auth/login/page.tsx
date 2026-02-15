import { setRequestLocale } from "next-intl/server";
import { LoginForm } from "@/components/auth/login-form";

interface PageProps {
    params: Promise<{ locale: string }>;
}

export default async function LoginPage({ params }: PageProps) {
    const { locale } = await params;
    setRequestLocale(locale);

    return <LoginForm />;
}
