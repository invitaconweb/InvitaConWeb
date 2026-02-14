"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "./language-switcher";
import { Sparkles, Menu, X } from "lucide-react";
import { useState } from "react";

export function Header() {
    const t = useTranslations("header");
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-lg">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2">
                    <Sparkles className="h-6 w-6 text-primary" />
                    <span className="text-xl font-bold tracking-tight">
                        {t("brand")}
                    </span>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden items-center gap-6 md:flex">
                    <a
                        href="#templates"
                        className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                    >
                        {t("nav.templates")}
                    </a>
                    <a
                        href="#how-it-works"
                        className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                    >
                        {t("nav.howItWorks")}
                    </a>
                    <a
                        href="#pricing"
                        className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                    >
                        {t("nav.pricing")}
                    </a>
                </nav>

                {/* Desktop Actions */}
                <div className="hidden items-center gap-3 md:flex">
                    <LanguageSwitcher />
                    <Button variant="ghost" size="sm">
                        {t("nav.login")}
                    </Button>
                    <Button size="sm">{t("nav.getStarted")}</Button>
                </div>

                {/* Mobile Menu Toggle */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ? (
                        <X className="h-5 w-5" />
                    ) : (
                        <Menu className="h-5 w-5" />
                    )}
                </Button>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="border-t border-border/40 bg-background px-4 pb-4 md:hidden">
                    <nav className="flex flex-col gap-3 pt-4">
                        <a
                            href="#templates"
                            className="text-sm font-medium text-muted-foreground"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            {t("nav.templates")}
                        </a>
                        <a
                            href="#how-it-works"
                            className="text-sm font-medium text-muted-foreground"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            {t("nav.howItWorks")}
                        </a>
                        <a
                            href="#pricing"
                            className="text-sm font-medium text-muted-foreground"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            {t("nav.pricing")}
                        </a>
                        <div className="flex items-center gap-2 pt-2">
                            <LanguageSwitcher />
                        </div>
                        <div className="flex gap-2 pt-2">
                            <Button variant="ghost" size="sm" className="flex-1">
                                {t("nav.login")}
                            </Button>
                            <Button size="sm" className="flex-1">
                                {t("nav.getStarted")}
                            </Button>
                        </div>
                    </nav>
                </div>
            )}
        </header>
    );
}
