"use client";

import { useForm } from "@tanstack/react-form";
import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import VerifyOtpModal from "@/components/Authentication/VerifyOtpModal";
import {ILoginPayload, loginZodSchema } from "@/zod/auth.validation";
import { useMutation } from "@tanstack/react-query";
import { loginAction } from "@/app/login/_actions";



const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isVerifyModal, setVerifyModal] = useState(false);
  const closeModal = () => setVerifyModal(false);
  const [loading, setLoading] = useState(false);
  const [loginData, setLoginData] = useState<{
    email: string;
    password: string;
  } | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  const router = useRouter();

  const {mutateAsync} = useMutation({
    mutationFn: (payload: ILoginPayload) => loginAction(payload),
  })

  // ─── TanStack Form ───────────────────────────────────────────────────────────
  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      setServerError(null);  
      setLoading(true);
      const toastId = toast.loading("Login Processing !");
      setLoginData({ email: value.email, password: value.password });

      try {
        const res = await mutateAsync(value) as any;
        
        if(!res.success){
            setServerError(res.message || "Login failed");
            toast.error(res.message || "Login failed", { id: toastId });
            setLoading(false);
            return ;
        }
        toast.success("Login Successfully", { id: toastId, duration: 2000 });
        form.reset();
        setLoading(false);
        router.push("/dashboard");
        // if (res?.data?.user?.email_verified === false) {
        //   toast.success("OTP sent! Please verify.", { id: toastId });
        //   form.reset();
        //   setLoading(false);
        //   setVerifyModal(true);
        // } else if (res?.data?.user?.email_verified === true) {
        //   const { user, token } = res?.data;
        //   dispatch(setToken({ accessToken: token }));
        //   dispatch(
        //     setUserInfo({
        //       email: user.email,
        //       name: user.name,
        //       category: user.category,
        //       email_verified: user.email_verified,
        //     })
        //   );
        //   form.reset();
        //   toast.success("Login Successfully", { id: toastId, duration: 2000 });
        //   const redirectRoute = sessionStorage.getItem("redirect_to");
        //   if (redirectRoute) {
        //     router.push(JSON.parse(redirectRoute));
        //     return;
        //   }
        //   setLoading(false);
        //   router.push("/dashboard");
        // } else {
        //   toast.error(res?.data?.message || "Valid Information Provide!", {
        //     id: toastId,
        //     duration: 2000,
        //   });
        //   setLoading(false);
        // }
      } catch (error: any) {
        console.log(`Login failed: ${error.message}`);
        setServerError(`Login failed: ${error.message}`);
        toast.error(`Login failed: ${error.message}`, { id: toastId });
        setLoading(false);
      }
    },
  });
  // ─────────────────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4">
      <VerifyOtpModal
        isOpen={isVerifyModal}
        onClose={closeModal}
        loginData={loginData}
      />
      <div className="fixed inset-0 -z-10">
        <video
          autoPlay
          loop
          muted
          className="w-full h-full object-cover"
          poster="/placeholder.svg?height=1080&width=1920"
        >
          <source src="/BackgroundFile/Auth.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/30" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl grid md:grid-cols-2 rounded-2xl overflow-hidden backdrop-blur bg-white/10"
      >
        {/* Welcome Section */}
        <div className="hidden md:block p-12">
          <div className="h-full flex flex-col items-center justify-center text-white text-center">
            <h2 className="text-xl font-bold mb-4">
              Access your account to explore more amazing features.
            </h2>
            <p className="mb-8 text-white/90">Don't have an account?</p>
            <Link
              href="/register"
              className="px-6 py-2 border-2 border-white rounded-full
                       hover:bg-white hover:text-[#c48200] transition-colors"
            >
              Sign Up
            </Link>
          </div>
        </div>

        {/* Login Form */}
        <div className="p-8 md:p-12">
          <div className="w-full max-w-sm mx-auto space-y-6">
            {/*
             * TanStack Form uses form.handleSubmit() directly on the <form>
             * instead of wrapping with handleSubmit(onSubmit).
             */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                form.handleSubmit();
              }}
              className="space-y-4"
            >
              {/* ── Email Field ── */}
              <form.Field
                name="email"
                validators={{
                onChange: ({ value }) => {
                const result = loginZodSchema.shape.email.safeParse(value);
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
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-md
                               text-white placeholder:text-white/50
                               focus:outline-none focus:border-white/40"
                      placeholder="Email"
                    />
                    {/* Errors appear after the user has touched the field */}
                    {field.state.meta.isTouched &&
                      field.state.meta.errors.length > 0 && (
                        <p className="text-red-400 text-sm">
                          {field.state.meta.errors.join(", ")}
                        </p>
                      )}
                  </div>
                )}
              </form.Field>

              {/* ── Password Field ── */}
              <form.Field
                name="password"
                validators={{
                  onChange: ({ value }) => {
                    const result = loginZodSchema.shape.password.safeParse(value);
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
                      Password *
                    </label>
                    <div className="relative">
                      <input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        type={showPassword ? "text" : "password"}
                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-md
                                 text-white placeholder:text-white/50
                                 focus:outline-none focus:border-white/40"
                        placeholder="Password"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-3 flex items-center text-white/50 hover:text-white"
                        onClick={() => setShowPassword((prev) => !prev)}
                      >
                        {showPassword ? (
                          <Eye size={20} />
                        ) : (
                          <EyeOff size={20} />
                        )}
                      </button>
                    </div>
                    {field.state.meta.isTouched &&
                      field.state.meta.errors.length > 0 && (
                        <p className="text-red-400 text-sm">
                          {field.state.meta.errors.join(", ")}
                        </p>
                      )}
                  </div>
                )}
              </form.Field>

              <div>
                <button
                  type="button"
                  className="text-sm text-white/80 hover:text-white"
                >
                  Forgot Password?
                </button>
              </div>

              {/*
               * form.state.canSubmit becomes false while the form is
               * submitting or has blocking validation errors.
               */}
              <button
                type="submit"
                disabled={loading || !form.state.canSubmit}
                className="w-full py-2 px-4 bg-[#c48200] text-white rounded-md
                          transition-colors disabled:opacity-60
                          focus:outline-none focus:ring-offset-2"
              >
                {loading ? "Loading..." : "Sign In"}
              </button>

              {serverError && (
                <p className="text-red-400 text-sm">{serverError}</p>
              )}    
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;