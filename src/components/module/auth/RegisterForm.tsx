"use client";

import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { Eye, EyeOff, User, Mail, Lock, ArrowRight, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import VerifyOtpModal from "@/components/Authentication/VerifyOtpModal";
import { IRegisterPayload, registerZodSchema } from "@/zod/auth.validation";
import { registerAction } from "@/app/register/_actions";
import { Button } from "@/components/ui/button";

const RegisterForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isVerifyModal, setVerifyModal] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [loginData, setLoginData] = useState<{ email: string; password: string } | null>(null);
  
  const router = useRouter();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (payload: IRegisterPayload) => registerAction(payload),
  });

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      setServerError(null);
      const toastId = toast.loading("Creating your account...");
      setLoginData({ email: value.email, password: value.password });

      try {
        const res = (await mutateAsync(value)) as any;

        if (!res.success) {
          setServerError(res.message || "Registration failed");
          toast.error(res.message || "Registration failed", { id: toastId });
          return;
        }

        const emailVerified = res?.data?.user?.emailVerified ?? res?.data?.user?.email_verified;

        if (emailVerified === false) {
          toast.success("Account created! Verify your email.", { id: toastId });
          setVerifyModal(true);
          return;
        }

        toast.success(res.message || "Registration Successful", { id: toastId });
        router.push("/login");
      } catch (error: any) {
        setServerError(error.message);
        toast.error("An unexpected error occurred", { id: toastId });
      }
    },
  });

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-6 overflow-hidden">
      <VerifyOtpModal
        isOpen={isVerifyModal}
        onClose={() => setVerifyModal(false)}
        loginData={loginData}
      />

      {/* Video Background with Overlay */}
      <div className="fixed inset-0 -z-10">
        <video autoPlay loop muted className="w-full h-full object-cover" poster="/placeholder.svg">
          <source src="/BackgroundFile/Auth.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-neutral-950/40 backdrop-blur-[2px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-4xl grid md:grid-cols-2 rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl backdrop-blur-xl bg-white/[0.03]"
      >
        {/* Left Side: Login Form Area */}
        <div className="p-8 md:p-14 bg-black/20 order-2 md:order-1">
          <div className="max-w-sm mx-auto space-y-8">
            <div className="space-y-2 text-center md:text-left">
              <h2 className="text-2xl font-black text-white tracking-tight">Create Account</h2>
              <p className="text-neutral-400 text-sm font-medium">Join us to start your journey today.</p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                form.handleSubmit();
              }}
              className="space-y-4"
            >
              {/* Name Field */}
              <form.Field
                name="name"
                validators={{
                  onChange: ({ value }) => {
                    const result = registerZodSchema.shape.name.safeParse(value);
                    return result.success ? undefined : result.error.issues[0].message;
                  },
                }}
              >
                {(field) => (
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 ml-1">Full Name</label>
                    <div className="relative group">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 group-focus-within:text-primary transition-colors" size={18} />
                      <input
                        {...field.state}
                        id={field.name}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        placeholder="John Doe"
                        className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-all font-medium text-sm"
                      />
                    </div>
                    {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                      <p className="text-red-400 text-[10px] font-bold uppercase ml-1">{field.state.meta.errors[0]}</p>
                    )}
                  </div>
                )}
              </form.Field>

              {/* Email Field */}
              <form.Field
                name="email"
                validators={{
                  onChange: ({ value }) => {
                    const result = registerZodSchema.shape.email.safeParse(value);
                    return result.success ? undefined : result.error.issues[0].message;
                  },
                }}
              >
                {(field) => (
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 ml-1">Email Address</label>
                    <div className="relative group">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 group-focus-within:text-primary transition-colors" size={18} />
                      <input
                        {...field.state}
                        id={field.name}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        placeholder="name@example.com"
                        className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-all font-medium text-sm"
                      />
                    </div>
                    {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                      <p className="text-red-400 text-[10px] font-bold uppercase ml-1">{field.state.meta.errors[0]}</p>
                    )}
                  </div>
                )}
              </form.Field>

              {/* Password Field */}
              <form.Field
                name="password"
                validators={{
                  onChange: ({ value }) => {
                    const result = registerZodSchema.shape.password.safeParse(value);
                    return result.success ? undefined : result.error.issues[0].message;
                  },
                }}
              >
                {(field) => (
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 ml-1">Password</label>
                    <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 group-focus-within:text-primary transition-colors" size={18} />
                      <input
                        {...field.state}
                        type={showPassword ? "text" : "password"}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        placeholder="••••••••"
                        className="w-full pl-12 pr-12 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-all font-medium text-sm"
                      />
                      <button
                        type="button"
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                      </button>
                    </div>
                    {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                      <p className="text-red-400 text-[10px] font-bold uppercase ml-1">{field.state.meta.errors[0]}</p>
                    )}
                  </div>
                )}
              </form.Field>

              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={isPending || !form.state.canSubmit}
                  className="w-full h-14 bg-primary hover:bg-primary-dark text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-primary/20 transition-all active:scale-[0.98] disabled:opacity-50"
                >
                  {isPending ? "Creating Account..." : "Sign Up"}
                </Button>
              </div>

              <AnimatePresence>
                {serverError && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-center">
                    <p className="text-red-400 text-[11px] font-bold uppercase">{serverError}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </div>
        </div>

        {/* Right Side: Welcome/Switch Section */}
        <div className="hidden md:flex flex-col justify-between p-12 bg-gradient-to-tl from-primary/20 to-transparent border-l border-white/5 order-1 md:order-2">
          <div className="space-y-4">
            <div className="h-12 w-12 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
              <Sparkles className="text-white" size={28} />
            </div>
            <h1 className="text-4xl font-black text-white tracking-tighter leading-none">
              BEGIN YOUR <br /> <span className="text-primary">ADVENTURE.</span>
            </h1>
            <p className="text-neutral-300 text-sm font-medium leading-relaxed max-w-[260px]">
              Unlock priority bookings and personalized coastal recommendations.
            </p>
          </div>

          <div className="space-y-6">
            <p className="text-white/50 text-xs font-bold uppercase tracking-widest">Member already?</p>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-primary hover:text-white transition-all duration-500 group"
            >
              Sign In Now
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterForm;