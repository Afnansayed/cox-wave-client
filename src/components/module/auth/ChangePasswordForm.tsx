"use client";

import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  changePasswordZodSchema,
  IChangePasswordPayload,
} from "@/zod/auth.validation";
import { changePasswordAction } from "@/app/(withDashboardLayout)/@admin/admin-dashboard/change-password/_actions";
import { useRouter } from "next/navigation";
import { logoutUser } from "@/components/Authentication/logoutUser";



const ChangePasswordForm = () => {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const router = useRouter();

  const { mutateAsync } = useMutation({
    mutationFn: (payload: IChangePasswordPayload) =>
      changePasswordAction(payload),
  });

  const form = useForm({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
    },
    onSubmit: async ({ value }) => {
      setServerError(null);
      setLoading(true);
      const toastId = toast.loading("Changing password...");

      try {
        const res = await mutateAsync(value);

        if (!res.success) {
          setServerError(res.message || "Failed to change password");
          toast.error(res.message || "Failed to change password", {
            id: toastId,
          });
          setLoading(false);
          return;
        }

        toast.success(res.message || "Password changed successfully", {
          id: toastId,
          duration: 2000,
        });
        form.reset();
        setLoading(false);
        await logoutUser();
        router.push('/login');
      } catch (error: any) {
        const message = error?.message || "Failed to change password";
        setServerError(message);
        toast.error(message, { id: toastId });
        setLoading(false);
      }
    },
  });

  return (
    <section className="mx-auto w-full max-w-lg rounded-xl border border-border bg-card text-card-foreground p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-foreground">Change Password</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Update your password to keep your account secure.
      </p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="mt-6 space-y-4"
      >
        <form.Field
          name="currentPassword"
          validators={{
            onChange: ({ value }) => {
              const result =
                changePasswordZodSchema.shape.currentPassword.safeParse(value);
              return result.success ? undefined : result.error.issues[0].message;
            },
          }}
        >
          {(field) => (
            <div className="space-y-2">
              <label
                htmlFor={field.name}
                className="text-sm font-medium text-foreground"
              >
                Current Password
              </label>
              <div className="relative">
                <input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  type={showCurrentPassword ? "text" : "password"}
                  className="w-full rounded-md border border-input bg-background px-4 py-2 pr-11 text-foreground focus:border-primary focus:outline-none"
                  placeholder="Enter current password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-3 flex items-center text-muted-foreground"
                  onClick={() => setShowCurrentPassword((prev) => !prev)}
                >
                  {showCurrentPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
              </div>
              {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                <p className="text-sm text-destructive">
                  {field.state.meta.errors.join(", ")}
                </p>
              )}
            </div>
          )}
        </form.Field>

        <form.Field
          name="newPassword"
          validators={{
            onChange: ({ value, fieldApi }) => {
              const currentPassword =
                fieldApi.form.getFieldValue("currentPassword") || "";
              const result = changePasswordZodSchema.safeParse({
                currentPassword,
                newPassword: value,
              });

              if (result.success) {
                return undefined;
              }

              const newPasswordError = result.error.issues.find(
                (issue) => issue.path[0] === "newPassword"
              );

              return newPasswordError?.message;
            },
          }}
        >
          {(field) => (
            <div className="space-y-2">
              <label
                htmlFor={field.name}
                className="text-sm font-medium text-foreground"
              >
                New Password
              </label>
              <div className="relative">
                <input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  type={showNewPassword ? "text" : "password"}
                  className="w-full rounded-md border border-input bg-background px-4 py-2 pr-11 text-foreground focus:border-primary focus:outline-none"
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-3 flex items-center text-muted-foreground"
                  onClick={() => setShowNewPassword((prev) => !prev)}
                >
                  {showNewPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
              </div>
              {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                <p className="text-sm text-destructive">
                  {field.state.meta.errors.join(", ")}
                </p>
              )}
            </div>
          )}
        </form.Field>

        <button
          type="submit"
          disabled={loading || !form.state.canSubmit}
          className="w-full rounded-md bg-primary px-4 py-2 font-medium text-white transition-colors disabled:opacity-60"
        >
          {loading ? "Updating..." : "Update Password"}
        </button>

        {serverError && (
          <p className="text-sm font-medium text-destructive">{serverError}</p>
        )}
      </form>
    </section>
  );
};

export default ChangePasswordForm;
