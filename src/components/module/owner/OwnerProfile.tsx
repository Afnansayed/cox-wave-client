"use client";

import Image from "next/image";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
    User, Mail, Phone, MapPin, Building2, Star,
    BookOpen, BadgeCheck, CreditCard, FileText, Calendar, Pencil,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getMyProfileOwner } from "@/components/services/owner.service";
import UpdateOwnerProfileForm from "@/components/module/owner/UpdateOwnerProfileForm";

const OwnerProfile = () => {
    const [isEditing, setIsEditing] = useState(false);

    const { data: profileResponse, isLoading, isError } = useQuery({
        queryKey: ["owner-my-profile"],
        queryFn: () => getMyProfileOwner(),
    });

    const owner = profileResponse?.data;

    if (isLoading) {
        return (
            <section className="space-y-6 p-4 md:p-8">
                <div className="animate-pulse space-y-4">
                    <div className="h-32 w-32 rounded-full bg-muted mx-auto md:mx-0" />
                    <div className="h-8 w-48 rounded bg-muted" />
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="h-20 rounded-2xl bg-muted" />
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (isError || !owner) {
        return (
            <section className="flex items-center justify-center p-8">
                <p className="text-sm text-muted-foreground">Failed to load profile. Please try again.</p>
            </section>
        );
    }

    return (
        <section className="space-y-6 p-4 md:p-8">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
                <div className="flex flex-col md:flex-row md:items-center gap-5">
                    {owner.profile_picture ? (
                        <Image
                            src={owner.profile_picture}
                            alt={owner.name}
                            width={96}
                            height={96}
                            className="h-24 w-24 rounded-full object-cover border-4 border-primary/20 shadow-md"
                        />
                    ) : (
                        <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center border-4 border-primary/20 shadow-md flex-shrink-0">
                            <User className="h-10 w-10 text-primary" />
                        </div>
                    )}

                    <div className="space-y-1">
                        <h1 className="text-2xl font-bold tracking-tight">{owner.name}</h1>
                        <p className="text-sm text-muted-foreground">{owner.email}</p>
                        <Badge
                            className={owner.isApproved
                                ? "bg-green-100 text-green-700 hover:bg-green-100"
                                : "bg-yellow-100 text-yellow-700 hover:bg-yellow-100"}
                        >
                            {owner.isApproved ? "Approved" : "Pending Approval"}
                        </Badge>
                    </div>
                </div>

                {/* Edit / Cancel toggle */}
                {!isEditing && (
                    <Button
                        onClick={() => setIsEditing(true)}
                        variant="outline"
                        className="self-start md:self-center flex items-center gap-2"
                    >
                        <Pencil className="h-4 w-4" />
                        Edit Profile
                    </Button>
                )}
            </div>

            {/* Edit Form */}
            {isEditing ? (
                <div className="rounded-2xl border bg-white p-6 shadow-sm">
                    <h2 className="text-base font-bold mb-5">Update Profile</h2>
                    <UpdateOwnerProfileForm
                        owner={owner}
                        onCancel={() => setIsEditing(false)}
                    />
                </div>
            ) : (
                <>
                    {/* Personal Info */}
                    <div>
                        <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-3">
                            Personal Information
                        </h2>
                        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                            <InfoCard icon={<Mail className="h-4 w-4 text-primary" />} label="Email" value={owner.email} />
                            <InfoCard icon={<Phone className="h-4 w-4 text-primary" />} label="Phone" value={owner.phone_number || "N/A"} />
                            <InfoCard icon={<MapPin className="h-4 w-4 text-primary" />} label="Address" value={owner.address || "N/A"} />
                        </div>
                    </div>

                    {/* Business Info */}
                    <div>
                        <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-3">
                            Business Information
                        </h2>
                        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                            <InfoCard icon={<Building2 className="h-4 w-4 text-primary" />} label="Business Name" value={owner.business_name || "N/A"} />
                            <InfoCard icon={<MapPin className="h-4 w-4 text-primary" />} label="Business Address" value={owner.business_address || "N/A"} />
                            <InfoCard icon={<CreditCard className="h-4 w-4 text-primary" />} label="Bank Account" value={owner.bank_account || "N/A"} />
                            <InfoCard icon={<Star className="h-4 w-4 text-primary" />} label="Rating" value={String(owner.rating ?? 0)} />
                            <InfoCard icon={<BookOpen className="h-4 w-4 text-primary" />} label="Total Reviews" value={String(owner.total_reviews)} />
                            <InfoCard icon={<BadgeCheck className="h-4 w-4 text-primary" />} label="Approval Status" value={owner.isApproved ? "Approved" : "Pending"} />
                        </div>
                    </div>

                    {/* Description */}
                    {owner.description && (
                        <div>
                            <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-3">
                                Description
                            </h2>
                            <div className="rounded-2xl border bg-white p-5 shadow-sm">
                                <p className="text-sm leading-relaxed text-muted-foreground">{owner.description}</p>
                            </div>
                        </div>
                    )}

                    {/* Trade License */}
                    {owner.trade_license && (
                        <div>
                            <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-3">
                                Documents
                            </h2>
                            <div className="rounded-2xl border bg-white p-5 shadow-sm flex items-center gap-3">
                                <FileText className="h-4 w-4 text-primary flex-shrink-0" />
                                <a
                                    href={owner.trade_license}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-sm font-semibold text-primary underline underline-offset-2"
                                >
                                    View Trade License
                                </a>
                            </div>
                        </div>
                    )}

                    {/* Timestamps */}
                    <div>
                        <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-3">
                            Account Details
                        </h2>
                        <div className="grid gap-4 md:grid-cols-2">
                            <InfoCard
                                icon={<Calendar className="h-4 w-4 text-primary" />}
                                label="Member Since"
                                value={new Date(owner.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                            />
                            <InfoCard
                                icon={<Calendar className="h-4 w-4 text-primary" />}
                                label="Last Updated"
                                value={new Date(owner.updatedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                            />
                        </div>
                    </div>
                </>
            )}
        </section>
    );
};

type InfoCardProps = {
    icon: React.ReactNode;
    label: string;
    value: string;
};

const InfoCard = ({ icon, label, value }: InfoCardProps) => (
    <div className="rounded-2xl border bg-white p-5 shadow-sm flex items-start gap-3">
        <div className="mt-0.5 flex-shrink-0">{icon}</div>
        <div>
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="font-semibold text-sm mt-0.5">{value}</p>
        </div>
    </div>
);

export default OwnerProfile;