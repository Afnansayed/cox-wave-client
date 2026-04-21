"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createOwnerSchema } from "@/zod/owner.validation";
import { ICreateOwner } from "@/types/account.types";
import { createOwner } from "@/components/services/owner.service";

type FieldErrors = Record<string, string>;

const initialFormValues: ICreateOwner = {
  password: "",
  owner: {
    name: "",
    email: "",
    phone_number: "",
    address: "",
    business_name: "",
    description: "",
    business_address: "",
    bank_account: "",
  },
};

const CreateOwnerForm = () => {
  const router = useRouter();
  const [formValues, setFormValues] = useState<ICreateOwner>(initialFormValues);
  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(null);
  const [tradeLicenseFile, setTradeLicenseFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<FieldErrors>({});

  const mutation = useMutation({
    mutationFn: (formData: FormData) => createOwner(formData),
  });

  const getFieldError = (field: string) => errors[field] || "";

  const onChange = (
    field: keyof ICreateOwner["owner"],
    value: string,
  ) => {
    setFormValues((prev) => ({
      ...prev,
      owner: {
        ...prev.owner,
        [field]: value,
      },
    }));

    setErrors((prev) => {
      const next = { ...prev };
      delete next[`owner.${field}`];
      return next;
    });
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const payloadForValidation = {
      ...formValues,
      owner: {
        ...formValues.owner,
        profile_picture: undefined,
      },
    };

    const parsed = createOwnerSchema.safeParse(payloadForValidation);

    if (!parsed.success) {
      const mappedErrors: FieldErrors = {};
      parsed.error.issues.forEach((issue) => {
        const path = issue.path.join(".");
        if (!mappedErrors[path]) {
          mappedErrors[path] = issue.message;
        }
      });
      setErrors(mappedErrors);
      toast.error("Please fix validation errors and try again.");
      return;
    }

    setErrors({});

    const formData = new FormData();
    formData.append("data", JSON.stringify(parsed.data));

    if (profilePictureFile) {
      formData.append("profile_picture", profilePictureFile);
    }

    if (tradeLicenseFile) {
      formData.append("trade_license", tradeLicenseFile);
    }

    const toastId = toast.loading("Creating owner...");

    try {
      const response = await mutation.mutateAsync(formData);
      if (!response.success) {
        toast.error(response.message || "Failed to create owner.", { id: toastId });
        return;
      }

      toast.success(response.message || "Owner created successfully.", { id: toastId });
      router.push("/admin-dashboard/owner");
      router.refresh();
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to create owner.";
      toast.error(message, { id: toastId });
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-semibold">Password</label>
          <Input
            type="password"
            value={formValues.password}
            onChange={(e) => {
              setFormValues((prev) => ({ ...prev, password: e.target.value }));
              setErrors((prev) => {
                const next = { ...prev };
                delete next.password;
                return next;
              });
            }}
            placeholder="Enter account password"
            disabled={mutation.isPending}
          />
          {getFieldError("password") && (
            <p className="text-xs text-red-500">{getFieldError("password")}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold">Owner Name</label>
          <Input
            value={formValues.owner.name}
            onChange={(e) => onChange("name", e.target.value)}
            placeholder="Enter owner full name"
            disabled={mutation.isPending}
          />
          {getFieldError("owner.name") && (
            <p className="text-xs text-red-500">{getFieldError("owner.name")}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold">Email</label>
          <Input
            type="email"
            value={formValues.owner.email}
            onChange={(e) => onChange("email", e.target.value)}
            placeholder="owner@example.com"
            disabled={mutation.isPending}
          />
          {getFieldError("owner.email") && (
            <p className="text-xs text-red-500">{getFieldError("owner.email")}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold">Phone Number</label>
          <Input
            value={formValues.owner.phone_number || ""}
            onChange={(e) => onChange("phone_number", e.target.value)}
            placeholder="01712345678"
            disabled={mutation.isPending}
          />
          {getFieldError("owner.phone_number") && (
            <p className="text-xs text-red-500">{getFieldError("owner.phone_number")}</p>
          )}
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-semibold">Address</label>
          <Input
            value={formValues.owner.address || ""}
            onChange={(e) => onChange("address", e.target.value)}
            placeholder="Owner personal address"
            disabled={mutation.isPending}
          />
          {getFieldError("owner.address") && (
            <p className="text-xs text-red-500">{getFieldError("owner.address")}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold">Business Name</label>
          <Input
            value={formValues.owner.business_name}
            onChange={(e) => onChange("business_name", e.target.value)}
            placeholder="Business name"
            disabled={mutation.isPending}
          />
          {getFieldError("owner.business_name") && (
            <p className="text-xs text-red-500">{getFieldError("owner.business_name")}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold">Bank Account</label>
          <Input
            value={formValues.owner.bank_account}
            onChange={(e) => onChange("bank_account", e.target.value)}
            placeholder="Bank account number"
            disabled={mutation.isPending}
          />
          {getFieldError("owner.bank_account") && (
            <p className="text-xs text-red-500">{getFieldError("owner.bank_account")}</p>
          )}
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-semibold">Business Address</label>
          <Input
            value={formValues.owner.business_address || ""}
            onChange={(e) => onChange("business_address", e.target.value)}
            placeholder="Business address"
            disabled={mutation.isPending}
          />
          {getFieldError("owner.business_address") && (
            <p className="text-xs text-red-500">{getFieldError("owner.business_address")}</p>
          )}
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-semibold">Business Description</label>
          <textarea
            value={formValues.owner.description || ""}
            onChange={(e) => onChange("description", e.target.value)}
            placeholder="Business description"
            className="min-h-24 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm outline-none focus-visible:ring-1 focus-visible:ring-ring"
            disabled={mutation.isPending}
          />
          {getFieldError("owner.description") && (
            <p className="text-xs text-red-500">{getFieldError("owner.description")}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold">Profile Picture (File)</label>
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => setProfilePictureFile(e.target.files?.[0] || null)}
            disabled={mutation.isPending}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold">Trade License (File)</label>
          <Input
            type="file"
            accept="image/*,.pdf"
            onChange={(e) => setTradeLicenseFile(e.target.files?.[0] || null)}
            disabled={mutation.isPending}
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? "Creating..." : "Create Owner"}
        </Button>
        <Button type="button" variant="outline" disabled={mutation.isPending} onClick={() => router.push("/admin-dashboard/owner")}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default CreateOwnerForm;
