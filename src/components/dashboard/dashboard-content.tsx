"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
    Plus,
    Pencil,
    Trash2,
    Sparkles,
    CalendarDays,
    LogOut,
} from "lucide-react";
import type { Invitation } from "@/types";
import { createInvitation, deleteInvitation } from "@/actions/invitations";
import { signOut } from "@/actions/auth";
import { Link } from "@/i18n/navigation";

interface DashboardContentProps {
    invitations: Invitation[];
    userName: string;
    translations: {
        title: string;
        subtitle: string;
        createNew: string;
        noInvitations: string;
        noInvitationsDesc: string;
        edit: string;
        delete: string;
        draft: string;
        paid: string;
        confirmDelete: string;
        cancel: string;
        signOut: string;
    };
}

export function DashboardContent({
    invitations,
    userName,
    translations: t,
}: DashboardContentProps) {
    const router = useRouter();
    const [showCreate, setShowCreate] = useState(false);
    const [showDelete, setShowDelete] = useState<string | null>(null);
    const [newTitle, setNewTitle] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleCreate() {
        if (!newTitle.trim()) return;
        setLoading(true);
        const result = await createInvitation(newTitle.trim());
        if ("id" in result) {
            router.push(`/dashboard/${result.id}/edit`);
        }
        setLoading(false);
        setShowCreate(false);
        setNewTitle("");
    }

    async function handleDelete(id: string) {
        setLoading(true);
        await deleteInvitation(id);
        setShowDelete(null);
        setLoading(false);
        router.refresh();
    }

    return (
        <div className="min-h-screen bg-muted/30">
            {/* Top Bar */}
            <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
                    <Link href="/" className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-primary" />
                        <span className="font-bold">InvitaCon</span>
                    </Link>
                    <div className="flex items-center gap-3">
                        <span className="hidden text-sm text-muted-foreground sm:inline">
                            {userName}
                        </span>
                        <form action={signOut}>
                            <Button variant="ghost" size="sm" type="submit">
                                <LogOut className="mr-1 h-4 w-4" />
                                {t.signOut}
                            </Button>
                        </form>
                    </div>
                </div>
            </header>

            {/* Main */}
            <main className="mx-auto max-w-5xl px-4 py-8">
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">{t.title}</h1>
                        <p className="text-sm text-muted-foreground">{t.subtitle}</p>
                    </div>
                    <Button onClick={() => setShowCreate(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        {t.createNew}
                    </Button>
                </div>

                {invitations.length === 0 ? (
                    <Card className="border-dashed">
                        <CardContent className="flex flex-col items-center justify-center py-16">
                            <CalendarDays className="mb-4 h-12 w-12 text-muted-foreground/50" />
                            <h3 className="mb-1 text-lg font-semibold">
                                {t.noInvitations}
                            </h3>
                            <p className="mb-4 text-sm text-muted-foreground">
                                {t.noInvitationsDesc}
                            </p>
                            <Button onClick={() => setShowCreate(true)}>
                                <Plus className="mr-2 h-4 w-4" />
                                {t.createNew}
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {invitations.map((inv) => (
                            <Card
                                key={inv.id}
                                className="group transition-shadow hover:shadow-md"
                            >
                                <CardHeader className="pb-3">
                                    <div className="flex items-start justify-between">
                                        <CardTitle className="text-base">{inv.title}</CardTitle>
                                        <Badge
                                            variant={
                                                inv.status === "paid" ? "default" : "secondary"
                                            }
                                        >
                                            {inv.status === "paid" ? t.paid : t.draft}
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className="mb-4 text-xs text-muted-foreground">
                                        {new Date(inv.updated_at).toLocaleDateString()}
                                    </p>
                                    <div className="flex gap-2">
                                        <Button size="sm" variant="outline" asChild className="flex-1">
                                            <Link href={`/dashboard/${inv.id}/edit`}>
                                                <Pencil className="mr-1 h-3 w-3" />
                                                {t.edit}
                                            </Link>
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            className="text-destructive hover:text-destructive"
                                            onClick={() => setShowDelete(inv.id)}
                                        >
                                            <Trash2 className="h-3 w-3" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </main>

            {/* Create Dialog */}
            <Dialog open={showCreate} onOpenChange={setShowCreate}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{t.createNew}</DialogTitle>
                    </DialogHeader>
                    <Input
                        placeholder="Mi Boda, Bautizo de Lucas..."
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                    />
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setShowCreate(false)}
                        >
                            {t.cancel}
                        </Button>
                        <Button onClick={handleCreate} disabled={loading || !newTitle.trim()}>
                            {t.createNew}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation */}
            <Dialog
                open={!!showDelete}
                onOpenChange={() => setShowDelete(null)}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{t.confirmDelete}</DialogTitle>
                        <DialogDescription />
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setShowDelete(null)}
                        >
                            {t.cancel}
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={() => showDelete && handleDelete(showDelete)}
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
