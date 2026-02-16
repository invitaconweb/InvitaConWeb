"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    ArrowLeft,
    Users,
    CheckCircle,
    XCircle,
    Clock,
    UserPlus,
    Trash2,
    MessageSquare,
    UtensilsCrossed,
} from "lucide-react";
import type { Guest } from "@/types";
import { deleteGuest } from "@/actions/rsvp";
import { Link } from "@/i18n/navigation";

interface GuestListProps {
    invitationId: string;
    invitationTitle: string;
    guests: Guest[];
    stats: {
        total: number;
        confirmed: number;
        declined: number;
        pending: number;
        totalPlusOnes: number;
    };
    translations: {
        title: string;
        backToDashboard: string;
        confirmed: string;
        declined: string;
        pending: string;
        totalGuests: string;
        plusOnes: string;
        noGuests: string;
        noGuestsDesc: string;
        name: string;
        email: string;
        status: string;
        dietary: string;
        message: string;
        delete: string;
        confirmDelete: string;
        cancel: string;
    };
}

export function GuestList({
    invitationTitle,
    guests,
    stats,
    translations: t,
}: GuestListProps) {
    const router = useRouter();
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    async function handleDelete(id: string) {
        setLoading(true);
        await deleteGuest(id);
        setDeleteId(null);
        setLoading(false);
        router.refresh();
    }

    const statusConfig = {
        confirmed: {
            icon: CheckCircle,
            variant: "default" as const,
            label: t.confirmed,
            color: "text-green-600",
        },
        declined: {
            icon: XCircle,
            variant: "destructive" as const,
            label: t.declined,
            color: "text-red-600",
        },
        pending: {
            icon: Clock,
            variant: "secondary" as const,
            label: t.pending,
            color: "text-yellow-600",
        },
    };

    return (
        <div className="min-h-screen bg-muted/30">
            <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="mx-auto flex h-16 max-w-4xl items-center gap-4 px-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/dashboard">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-sm font-semibold">{t.title}</h1>
                        <p className="text-xs text-muted-foreground">{invitationTitle}</p>
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-4xl px-4 py-6">
                {/* Stats Cards */}
                <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                    <Card>
                        <CardContent className="flex items-center gap-3 p-4">
                            <Users className="h-8 w-8 text-blue-500" />
                            <div>
                                <p className="text-2xl font-bold">{stats.total}</p>
                                <p className="text-xs text-muted-foreground">{t.totalGuests}</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="flex items-center gap-3 p-4">
                            <CheckCircle className="h-8 w-8 text-green-500" />
                            <div>
                                <p className="text-2xl font-bold">{stats.confirmed}</p>
                                <p className="text-xs text-muted-foreground">{t.confirmed}</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="flex items-center gap-3 p-4">
                            <Clock className="h-8 w-8 text-yellow-500" />
                            <div>
                                <p className="text-2xl font-bold">{stats.pending}</p>
                                <p className="text-xs text-muted-foreground">{t.pending}</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="flex items-center gap-3 p-4">
                            <UserPlus className="h-8 w-8 text-purple-500" />
                            <div>
                                <p className="text-2xl font-bold">{stats.totalPlusOnes}</p>
                                <p className="text-xs text-muted-foreground">{t.plusOnes}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Guest List */}
                {guests.length === 0 ? (
                    <Card className="border-dashed">
                        <CardContent className="flex flex-col items-center justify-center py-16">
                            <Users className="mb-4 h-12 w-12 text-muted-foreground/50" />
                            <h3 className="mb-1 text-lg font-semibold">{t.noGuests}</h3>
                            <p className="text-sm text-muted-foreground">{t.noGuestsDesc}</p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-3">
                        {guests.map((guest) => {
                            const sc = statusConfig[guest.status];
                            const StatusIcon = sc.icon;

                            return (
                                <Card key={guest.id} className="transition-shadow hover:shadow-sm">
                                    <CardContent className="p-4">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <h3 className="font-medium">{guest.name}</h3>
                                                    <Badge variant={sc.variant} className="text-[10px]">
                                                        <StatusIcon className="mr-1 h-3 w-3" />
                                                        {sc.label}
                                                    </Badge>
                                                    {guest.plus_ones > 0 && (
                                                        <Badge variant="outline" className="text-[10px]">
                                                            +{guest.plus_ones}
                                                        </Badge>
                                                    )}
                                                </div>
                                                <p className="mt-0.5 text-xs text-muted-foreground">
                                                    {guest.email}
                                                </p>
                                                {guest.dietary_requirements && (
                                                    <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                                                        <UtensilsCrossed className="h-3 w-3" />
                                                        {guest.dietary_requirements}
                                                    </div>
                                                )}
                                                {guest.message && (
                                                    <div className="mt-1 flex items-start gap-1.5 text-xs text-muted-foreground">
                                                        <MessageSquare className="mt-0.5 h-3 w-3 flex-shrink-0" />
                                                        <span className="italic">{guest.message}</span>
                                                    </div>
                                                )}
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-destructive hover:text-destructive"
                                                onClick={() => setDeleteId(guest.id)}
                                            >
                                                <Trash2 className="h-3.5 w-3.5" />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                )}
            </main>

            {/* Delete Dialog */}
            <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{t.confirmDelete}</DialogTitle>
                        <DialogDescription />
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteId(null)}>
                            {t.cancel}
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={() => deleteId && handleDelete(deleteId)}
                            disabled={loading}
                        >
                            {t.delete}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
