"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { CheckCircle, ArrowLeft, Loader2, Sparkles } from "lucide-react";
import { submitRsvp } from "@/actions/rsvp";
import type { GuestStatus } from "@/types";
import { Link } from "@/i18n/navigation";

interface RsvpFormProps {
    invitationId: string;
    invitationTitle: string;
    accentColor: string;
    askDietary: boolean;
    allowPlusOnes: boolean;
    translations: {
        title: string;
        subtitle: string;
        name: string;
        namePlaceholder: string;
        email: string;
        emailPlaceholder: string;
        status: string;
        confirmed: string;
        declined: string;
        pending: string;
        dietary: string;
        dietaryPlaceholder: string;
        plusOnes: string;
        message: string;
        messagePlaceholder: string;
        submit: string;
        submitting: string;
        successTitle: string;
        successMessage: string;
        errorMessage: string;
        backToInvitation: string;
        required: string;
    };
}

export function RsvpForm({
    invitationId,
    invitationTitle,
    accentColor,
    askDietary,
    allowPlusOnes,
    translations: t,
}: RsvpFormProps) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<GuestStatus>("confirmed");
    const [dietary, setDietary] = useState("");
    const [plusOnes, setPlusOnes] = useState(0);
    const [message, setMessage] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!name.trim() || !email.trim()) return;

        setSubmitting(true);
        setError("");

        const result = await submitRsvp({
            invitationId,
            name: name.trim(),
            email: email.trim(),
            status,
            dietaryRequirements: dietary.trim() || undefined,
            plusOnes,
            message: message.trim() || undefined,
        });

        setSubmitting(false);

        if ("error" in result) {
            setError(t.errorMessage);
        } else {
            setSubmitted(true);
        }
    }

    if (submitted) {
        return (
            <div className="flex min-h-screen items-center justify-center px-4">
                <Card className="w-full max-w-md text-center">
                    <CardContent className="py-12">
                        <CheckCircle
                            className="mx-auto mb-4 h-16 w-16"
                            style={{ color: accentColor }}
                        />
                        <h2 className="mb-2 text-2xl font-bold">{t.successTitle}</h2>
                        <p className="mb-6 text-muted-foreground">{t.successMessage}</p>
                        <Button variant="outline" asChild>
                            <Link href={`/p/${invitationId}`}>
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                {t.backToInvitation}
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen items-center justify-center px-4 py-8">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <Sparkles className="mx-auto mb-2 h-6 w-6" style={{ color: accentColor }} />
                    <CardTitle className="text-xl">{t.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                        {invitationTitle} — {t.subtitle}
                    </p>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Name */}
                        <div className="space-y-1.5">
                            <Label htmlFor="rsvpName">
                                {t.name} <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="rsvpName"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder={t.namePlaceholder}
                                required
                            />
                        </div>

                        {/* Email */}
                        <div className="space-y-1.5">
                            <Label htmlFor="rsvpEmail">
                                {t.email} <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="rsvpEmail"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder={t.emailPlaceholder}
                                required
                            />
                        </div>

                        {/* Status */}
                        <div className="space-y-1.5">
                            <Label>{t.status}</Label>
                            <Select
                                value={status}
                                onValueChange={(v) => setStatus(v as GuestStatus)}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="confirmed">{t.confirmed}</SelectItem>
                                    <SelectItem value="declined">{t.declined}</SelectItem>
                                    <SelectItem value="pending">{t.pending}</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Plus Ones */}
                        {allowPlusOnes && (
                            <div className="space-y-1.5">
                                <Label htmlFor="rsvpPlusOnes">{t.plusOnes}</Label>
                                <Input
                                    id="rsvpPlusOnes"
                                    type="number"
                                    min={0}
                                    max={5}
                                    value={plusOnes}
                                    onChange={(e) => setPlusOnes(parseInt(e.target.value) || 0)}
                                />
                            </div>
                        )}

                        {/* Dietary */}
                        {askDietary && (
                            <div className="space-y-1.5">
                                <Label htmlFor="rsvpDietary">{t.dietary}</Label>
                                <Input
                                    id="rsvpDietary"
                                    value={dietary}
                                    onChange={(e) => setDietary(e.target.value)}
                                    placeholder={t.dietaryPlaceholder}
                                />
                            </div>
                        )}

                        {/* Message */}
                        <div className="space-y-1.5">
                            <Label htmlFor="rsvpMessage">{t.message}</Label>
                            <Textarea
                                id="rsvpMessage"
                                rows={3}
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder={t.messagePlaceholder}
                            />
                        </div>

                        {error && (
                            <p className="text-sm text-destructive">{error}</p>
                        )}

                        <Button
                            type="submit"
                            className="w-full"
                            style={{ backgroundColor: accentColor }}
                            disabled={submitting || !name.trim() || !email.trim()}
                        >
                            {submitting ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : null}
                            {submitting ? t.submitting : t.submit}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
