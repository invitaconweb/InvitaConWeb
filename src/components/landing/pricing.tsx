"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Check,
    Palette,
    Link2,
    Users,
    Smartphone,
    Share2,
    Mail,
} from "lucide-react";

const featureIcons: Record<string, React.ElementType> = {
    design: Palette,
    url: Link2,
    rsvp: Users,
    responsive: Smartphone,
    og: Share2,
    support: Mail,
};

export function Pricing() {
    const t = useTranslations("pricing");

    const features = ["design", "url", "rsvp", "responsive", "og", "support"];

    return (
        <section id="pricing" className="bg-muted/30 py-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-2xl text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                        {t("title")}
                    </h2>
                    <p className="mt-4 text-lg text-muted-foreground">{t("subtitle")}</p>
                </div>

                <div className="mx-auto mt-16 max-w-md">
                    <Card className="relative overflow-hidden border-primary/20 shadow-xl">
                        {/* Decorative top bar */}
                        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-primary/80 to-primary" />
                        <CardHeader className="pb-4 pt-8 text-center">
                            <CardTitle className="text-2xl font-bold">
                                {t("card.title")}
                            </CardTitle>
                            <div className="mt-4">
                                <span className="text-5xl font-extrabold tracking-tight text-foreground">
                                    {t("card.price")}
                                </span>
                                <span className="ml-2 text-base text-muted-foreground">
                                    / {t("card.period")}
                                </span>
                            </div>
                        </CardHeader>
                        <CardContent className="pb-2">
                            <ul className="space-y-4">
                                {features.map((feature) => {
                                    const Icon = featureIcons[feature];
                                    return (
                                        <li key={feature} className="flex items-center gap-3">
                                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                                <Icon className="h-4 w-4" />
                                            </div>
                                            <span className="text-sm text-foreground">
                                                {t(`card.features.${feature}`)}
                                            </span>
                                            <Check className="ml-auto h-4 w-4 text-primary" />
                                        </li>
                                    );
                                })}
                            </ul>
                        </CardContent>
                        <CardFooter className="pt-6 pb-8">
                            <Button size="lg" className="w-full text-base">
                                {t("card.cta")}
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </section>
    );
}
