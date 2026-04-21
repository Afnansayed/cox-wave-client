"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IOwner } from "@/types/account.types";
import { updateOwnerProfile } from "@/components/services/owner.service";
import {
  updateOwnerProfileSchema,
  UpdateOwnerProfileFormValues,
} from "@/zod/owner.validation";

type FieldErrors = Partial<Record<keyof UpdateOwnerProfileFormValues, string>>;

type UpdateOwnerProfileFormProps = {
  owner: IOwner;
  onCancel: () => void;
};

const UpdateOwnerProfileForm = ({ owner, onCancel }: UpdateOwnerProfileFormProps) => {
  const queryClient = useQueryClient();

  const [formValues, setFormValues] = useState<UpdateOwnerProfileFormValues>({
    name: owner.name ?? "",
    phone_number: owner.phone_number ?? "",
    address: owner.address ?? "",
    business_name: owner.business_name ?? "",
    description: owner.description ?? "",
    business_address: owner.business_address ?? "",
    bank_account: owner.bank_account ?? "",
  });

  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(null);
  const [tradeLicenseFile, setTradeLicenseFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<FieldErrors>({});

  const mutation = useMutation({
    mutationFn: (formData: FormData) => updateOwnerProfile(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["owner-my-profile"] });
    },
  });

  const getFieldError = (field: keyof UpdateOwnerProfileFormValues) =>
    errors[field] || "";

  const onChange = (
    field: keyof UpdateOwnerProfileFormValues,
    value: string,
  ) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Strip empty strings so server treats them as "not provided"
    const cleanedValues = Object.fromEntries(
      Object.entries(formValues).filter(([, v]) => v !== ""),
    ) as UpdateOwnerProfileFormValues;

    const parsed = updateOwnerProfileSchema.safeParse(cleanedValues);

    if (!parsed.success) {
      const mappedErrors: FieldErrors = {};
      parsed.error.issues.forEach((issue) => {
        const key = issue.path[0] as keyof UpdateOwnerProfileFormValues;
        if (!mappedErrors[key]) mappedErrors[key] = issue.message;
      });
      setErrors(mappedErrors);
      toast.error("Please fix the validation errors and try again.");
      return;
    }

    setErrors({});

    // Build multipart FormData — API expects `data` (JSON) + optional files
    const formData = new FormData();
    formData.append("data", JSON.stringify(parsed.data));
    if (profilePictureFile) formData.append("profile_picture", profilePictureFile);
    if (tradeLicenseFile) formData.append("trade_license", tradeLicenseFile);

    const toastId = toast.loading("Updating profile...");

    try {
      const response = await mutation.mutateAsync(formData);

      if (!response.success) {
        toast.error(response.message || "Failed to update profile.", { id: toastId });
        return;
      }

      toast.success(response.message || "Profile updated successfully.", { id: toastId });
      onCancel();
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to update profile.";
      toast.error(message, { id: toastId });
    }
  };

  const isPending = mutation.isPending;

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* Personal Information */}
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-4">
          Personal Information
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold">Full Name</label>
            <Input
              value={formValues.name ?? ""}
              onChange={(e) => onChange("name", e.target.value)}
              placeholder="Your full name"
              disabled={isPending}
            />
            {getFieldError("name") && (
              <p className="text-xs text-red-500">{getFieldError("name")}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold">Phone Number</label>
            <Input
              value={formValues.phone_number ?? ""}
              onChange={(e) => onChange("phone_number", e.target.value)}
              placeholder="01XXXXXXXXX"
              disabled={isPending}
            />
            {getFieldError("phone_number") && (
              <p className="text-xs text-red-500">{getFieldError("phone_number")}</p>
            )}
          </div>

          <div className="space-y-1.5 md:col-span-2">
            <label className="text-sm font-semibold">Personal Address</label>
            <Input
              value={formValues.address ?? ""}
              onChange={(e) => onChange("address", e.target.value)}
              placeholder="Your home / personal address"
              disabled={isPending}
            />
            {getFieldError("address") && (
              <p className="text-xs text-red-500">{getFieldError("address")}</p>
            )}
          </div>
        </div>
      </div>

      {/* Business Information */}
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-4">
          Business Information
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold">Business Name</label>
            <Input
              value={formValues.business_name ?? ""}
              onChange={(e) => onChange("business_name", e.target.value)}
              placeholder="Your business name"
              disabled={isPending}
            />
            {getFieldError("business_name") && (
              <p className="text-xs text-red-500">{getFieldError("business_name")}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold">Bank Account Number</label>
            <Input
              value={formValues.bank_account ?? ""}
              onChange={(e) => onChange("bank_account", e.target.value)}
              placeholder="Numbers only"
              disabled={isPending}
            />
            {getFieldError("bank_account") && (
              <p className="text-xs text-red-500">{getFieldError("bank_account")}</p>
            )}
          </div>

          <div className="space-y-1.5 md:col-span-2">
            <label className="text-sm font-semibold">Business Address</label>
            <Input
              value={formValues.business_address ?? ""}
              onChange={(e) => onChange("business_address", e.target.value)}
              placeholder="Full business location"
              disabled={isPending}
            />
            {getFieldError("business_address") && (
              <p className="text-xs text-red-500">{getFieldError("business_address")}</p>
            )}
          </div>

          <div className="space-y-1.5 md:col-span-2">
            <label className="text-sm font-semibold">
              Description{" "}
              <span className="text-xs font-normal text-muted-foreground">(max 500 chars)</span>
            </label>
            <textarea
              value={formValues.description ?? ""}
              onChange={(e) => onChange("description", e.target.value)}
              placeholder="Brief description of your business"
              rows={4}
              disabled={isPending}
              className="w-full min-h-24 rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none disabled:opacity-50"
            />
            {getFieldError("description") && (
              <p className="text-xs text-red-500">{getFieldError("description")}</p>
            )}
          </div>
        </div>
      </div>

      {/* Documents */}
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-4">
          Documents &amp; Photos
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold">
              Profile Picture{" "}
              <span className="text-xs font-normal text-muted-foreground">(image file)</span>
            </label>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => setProfilePictureFile(e.target.files?.[0] || null)}
              disabled={isPending}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold">
              Trade License{" "}
              <span className="text-xs font-normal text-muted-foreground">(image or PDF)</span>
            </label>
            <Input
              type="file"
              accept="image/*,.pdf"
              onChange={(e) => setTradeLicenseFile(e.target.files?.[0] || null)}
              disabled={isPending}
            />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-2">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving..." : "Save Changes"}
        </Button>
        <Button type="button" variant="outline" disabled={isPending} onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default UpdateOwnerProfileForm;
