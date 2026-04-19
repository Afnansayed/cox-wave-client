"use client";

import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import {
  forgotPasswordZodSchema,
  IForgotPasswordPayload,
} from "@/zod/auth.validation";
import { forgotPasswordAction } from "@/app/forgot-password/_actions";

const ForgotPasswordForm = () => {
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const router = useRouter();

  const { mutateAsync } = useMutation({
    mutationFn: (payload: IForgotPasswordPayload) => forgotPasswordAction(payload),
  });

  const form = useForm({
    defaultValues: {
      email: "",
    },
    onSubmit: async ({ value }) => {
      setServerError(null);
      setLoading(true);
      const toastId = toast.loading("Sending OTP...");

      try {
        const res = await mutateAsync(value);

        if (!res.success) {
          setServerError(res.message || "Failed to send reset OTP");
          toast.error(res.message || "Failed to send reset OTP", { id: toastId });
          setLoading(false);
          return;
        }

        toast.success(res.message || "Reset OTP sent to your email", {
          id: toastId,
          duration: 2000,
        });
        router.push(`/reset-password?email=${encodeURIComponent(value.email)}`);
        setLoading(false);
      } catch (error: any) {
        const message = error?.message || "Failed to send reset OTP";
        setServerError(message);
        toast.error(message, { id: toastId });
        setLoading(false);
      }
    },
  });

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4">
      <div className="fixed inset-0 -z-10">
        <video autoPlay loop muted className="w-full h-full object-cover">
          <source src="/BackgroundFile/Auth.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/30" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md rounded-2xl overflow-hidden backdrop-blur bg-white/10 p-8"
      >
        <h2 className="text-white text-2xl font-bold">Forgot Password</h2>
        <p className="mt-2 text-white/80 text-sm">
          Enter your email to receive an OTP for resetting your password.
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-4 mt-6"
        >
          <form.Field
            name="email"
            validators={{
              onChange: ({ value }) => {
                const result = forgotPasswordZodSchema.shape.email.safeParse(value);
                return result.success ? undefined : result.error.issues[0].message;
              },
            }}
          >
            {(field) => (
              <div className="space-y-2">
                <label
                  htmlFor={field.name}
                  className="uppercase text-sm font-medium text-white/80"
                >
                  Email *
                </label>
                <input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder:text-white/50 focus:outline-none focus:border-white/40"
                  placeholder="Email"
                />
                {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                  <p className="text-red-400 text-sm">
                    {field.state.meta.errors.join(", ")}
                  </p>
                )}
              </div>
            )}
          </form.Field>

          <button
            type="submit"
            disabled={loading || !form.state.canSubmit}
            className="w-full py-2 px-4 bg-primary text-white rounded-md transition-colors disabled:opacity-60"
          >
            {loading ? "Sending..." : "Send OTP"}
          </button>

          {serverError && <p className="text-red-400 text-sm">{serverError}</p>}

          <Link href="/login" className="block text-center text-sm text-white/80 hover:text-white">
            Back to Login
          </Link>
        </form>
      </motion.div>
    </div>
  );
};

export default ForgotPasswordForm;
