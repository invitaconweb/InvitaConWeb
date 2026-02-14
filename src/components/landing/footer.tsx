"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Sparkles } from "lucide-react";

export function Footer() {
    const t = useTranslations("footer");

    return (
        <footer className="border-t border-border/40 bg-muted/20">
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="grid gap-8 md:grid-cols-4">
                    {/* Brand */}
                    <div className="md:col-span-1">
                        <Link href="/" className="flex items-center gap-2">
                            <Sparkles className="h-5 w-5 text-primary" />
                            <span className="text-lg font-bold">{t("brand")}</span>
                        </Link>
                        <p className="mt-3 text-sm text-muted-foreground">
                            {t("tagline")}
                        </p>
                    </div>

                    {/* Product Links */}
                    <div>
                        <h3 className="text-sm font-semibold text-foreground">
                            {t("links.product")}
                        </h3>
                        <ul className="mt-4 space-y-2">
                            <li>
                                <a
                                    href="#templates"
                                    className="text-sm text-muted-foreground hover:text-foreground"
                                >
                                    {t("links.templates")}
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#pricing"
                                    className="text-sm text-muted-foreground hover:text-foreground"
                                >
                                    {t("links.pricing")}
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="text-sm text-muted-foreground hover:text-foreground"
                                >
                                    {t("links.examples")}
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Legal Links */}
                    <div>
                        <h3 className="text-sm font-semibold text-foreground">
                            {t("links.legal")}
                        </h3>
                        <ul className="mt-4 space-y-2">
                            <li>
                                <a
                                    href="#"
                                    className="text-sm text-muted-foreground hover:text-foreground"
                                >
                                    {t("links.privacy")}
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="text-sm text-muted-foreground hover:text-foreground"
                                >
                                    {t("links.terms")}
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-sm font-semibold text-foreground">
                            {t("links.contact")}
                        </h3>
                        <ul className="mt-4 space-y-2">
                            <li>
                                <a
                                    href="mailto:hello@invitacon.com"
                                    className="text-sm text-muted-foreground hover:text-foreground"
                                >
                                    hello@invitacon.com
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-10 border-t border-border/40 pt-6 text-center">
                    <p className="text-xs text-muted-foreground">{t("copyright")}</p>
                </div>
            </div>
        </footer>
    );
}
