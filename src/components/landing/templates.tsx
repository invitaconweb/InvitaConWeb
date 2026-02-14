"use client";

import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Church, PartyPopper, Baby } from "lucide-react";

const templateData = [
    {
        id: "wedding",
        icon: Heart,
        gradient: "from-rose-100 to-pink-50 dark:from-rose-950/30 dark:to-pink-950/10",
        iconColor: "text-rose-500",
    },
    {
        id: "baptism",
        icon: Baby,
        gradient: "from-sky-100 to-blue-50 dark:from-sky-950/30 dark:to-blue-950/10",
        iconColor: "text-sky-500",
    },
    {
        id: "communion",
        icon: Church,
        gradient: "from-amber-100 to-yellow-50 dark:from-amber-950/30 dark:to-yellow-950/10",
        iconColor: "text-amber-500",
    },
    {
        id: "party",
        icon: PartyPopper,
        gradient: "from-violet-100 to-purple-50 dark:from-violet-950/30 dark:to-purple-950/10",
        iconColor: "text-violet-500",
    },
];

export function Templates() {
    const t = useTranslations("templates");

    return (
        <section id="templates" className="py-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-2xl text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                        {t("title")}
                    </h2>
                    <p className="mt-4 text-lg text-muted-foreground">{t("subtitle")}</p>
                </div>

                <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {templateData.map(({ id, icon: Icon, gradient, iconColor }) => (
                        <Card
                            key={id}
                            className="group cursor-pointer overflow-hidden border-border/50 transition-all hover:border-primary/30 hover:shadow-xl"
                        >
                            <div
                                className={`flex h-48 items-center justify-center bg-gradient-to-br ${gradient}`}
                            >
                                <Icon
                                    className={`h-16 w-16 ${iconColor} transition-transform group-hover:scale-110`}
                                />
                            </div>
                            <CardContent className="p-5">
                                <h3 className="text-base font-semibold text-foreground">
                                    {t(`categories.${id}`)}
                                </h3>
                                <Button
                                    variant="link"
                                    className="mt-1 h-auto p-0 text-sm text-primary"
                                >
                                    {t("cta")} →
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}
