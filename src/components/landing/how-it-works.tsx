"use client";

import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
import { Palette, PenTool, Share2 } from "lucide-react";

const stepIcons = [Palette, PenTool, Share2];

export function HowItWorks() {
    const t = useTranslations("howItWorks");

    const steps = [
        { key: "choose" as const, icon: stepIcons[0] },
        { key: "customize" as const, icon: stepIcons[1] },
        { key: "share" as const, icon: stepIcons[2] },
    ];

    return (
        <section id="how-it-works" className="bg-muted/30 py-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-2xl text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                        {t("title")}
                    </h2>
                    <p className="mt-4 text-lg text-muted-foreground">{t("subtitle")}</p>
                </div>

                <div className="mt-16 grid gap-8 md:grid-cols-3">
                    {steps.map(({ key, icon: Icon }) => (
                        <Card
                            key={key}
                            className="group relative overflow-hidden border-border/50 bg-background transition-all hover:border-primary/30 hover:shadow-lg"
                        >
                            <CardContent className="flex flex-col items-center p-8 text-center">
                                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                                    <Icon className="h-7 w-7" />
                                </div>
                                <h3 className="text-lg font-semibold text-foreground">
                                    {t(`steps.${key}.title`)}
                                </h3>
                                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                                    {t(`steps.${key}.description`)}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}
