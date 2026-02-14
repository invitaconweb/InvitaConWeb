"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

export function Hero() {
    const t = useTranslations("hero");

    return (
        <section className="relative overflow-hidden">
            {/* Background gradient */}
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(120,119,198,0.15),transparent)]" />

            <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
                <div className="mx-auto max-w-3xl text-center">
                    {/* Badge */}
                    <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-border/60 bg-muted/50 px-4 py-1.5 text-sm text-muted-foreground backdrop-blur-sm">
                        <Sparkles className="h-4 w-4" />
                        {t("badge")}
                    </div>

                    {/* Title */}
                    <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                        {t("title")}
                    </h1>

                    {/* Subtitle */}
                    <p className="mt-6 text-lg leading-8 text-muted-foreground sm:text-xl">
                        {t("subtitle")}
                    </p>

                    {/* CTAs */}
                    <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                        <Button size="lg" className="gap-2 text-base">
                            {t("cta")}
                            <ArrowRight className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="lg" className="text-base">
                            {t("ctaSecondary")}
                        </Button>
                    </div>

                    {/* Stats */}
                    <div className="mt-16 grid grid-cols-3 gap-8 border-t border-border/40 pt-8">
                        <div>
                            <p className="text-3xl font-bold text-foreground">500+</p>
                            <p className="mt-1 text-sm text-muted-foreground">
                                {t("stats.invitations")}
                            </p>
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-foreground">200+</p>
                            <p className="mt-1 text-sm text-muted-foreground">
                                {t("stats.events")}
                            </p>
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-foreground">99%</p>
                            <p className="mt-1 text-sm text-muted-foreground">
                                {t("stats.satisfaction")}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
