"use client";

import { useLocale, useTranslations } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";

const localeLabels: Record<string, string> = {
    es: "ES",
    en: "EN",
    eu: "EU",
};

export function LanguageSwitcher() {
    const t = useTranslations("languageSwitcher");
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();

    const handleLocaleChange = (newLocale: string) => {
        router.replace(pathname, { locale: newLocale });
    };

    return (
        <div className="flex items-center gap-1">
            <Globe className="h-4 w-4 text-muted-foreground" />
            {(["es", "en", "eu"] as const).map((loc) => (
                <Button
                    key={loc}
                    variant={locale === loc ? "default" : "ghost"}
                    size="sm"
                    className="h-7 px-2 text-xs font-medium"
                    onClick={() => handleLocaleChange(loc)}
                    title={t(loc)}
                >
                    {localeLabels[loc]}
                </Button>
            ))}
        </div>
    );
}
