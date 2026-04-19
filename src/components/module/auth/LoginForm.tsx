"use client";

import { useForm } from "@tanstack/react-form";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { Eye, EyeOff, Mail, Lock, ArrowRight, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation } from "@tanstack/react-query";

import VerifyOtpModal from "@/components/Authentication/VerifyOtpModal";
import { ILoginPayload, loginZodSchema } from "@/zod/auth.validation";
import { loginAction } from "@/app/login/_actions";
import { useAppDispatch } from "@/components/Redux/hooks";
import { setToken, setUserInfo } from "@/components/Redux/Slice/authSlice";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isVerifyModal, setVerifyModal] = useState(false);
  const [loginData, setLoginData] = useState<ILoginPayload | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  
  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Get redirect from query params (e.g., /login?redirect=/booking)
  const redirectPath = searchParams.get("redirect") || "/customer-dashboard";

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (payload: ILoginPayload) => loginAction(payload),
  });

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      setServerError(null);
      const toastId = toast.loading("Verifying credentials...");
      setLoginData(value);

      try {
        const res = (await mutateAsync(value)) as any;

        if (!res.success) {
          if (res?.message === "Email not verified") {
            toast.success("OTP sent! Please verify.", { id: toastId });
            setVerifyModal(true);
            return;
          }
          setServerError(res.message || "Login failed");
          toast.error(res.message || "Login failed", { id: toastId });
          return;
        }

        const { user, accessToken } = res?.data;
        dispatch(setToken({ accessToken }));
        dispatch(
          setUserInfo({
            email: user.email,
            name: user.name,
            role: user.role,
            emailVerified: user.emailVerified,
          })
        );

        toast.success(`Welcome back, ${user.name}!`, { id: toastId });
      
        if(redirectPath.length > 1 && redirectPath !== "/customer-dashboard"){
          router.push(redirectPath);
          return;
        }
        router.push('/customer-dashboard');
      } catch (error: any) {
        setServerError(error.message);
        toast.error("An unexpected error occurred", { id: toastId });
      }
    },
  });

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-6 overflow-hidden">
      <VerifyOtpModal isOpen={isVerifyModal} onClose={() => setVerifyModal(false)} loginData={loginData} />

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
        {/* Left Side: Brand/Welcome */}
        <div className="hidden md:flex flex-col justify-between p-12 bg-gradient-to-br from-primary/20 to-transparent border-r border-white/5">
          <div className="space-y-4">
            <div className="h-12 w-12 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
              <ShieldCheck className="text-white" size={28} />
            </div>
            <h1 className="text-4xl font-black text-white tracking-tighter leading-none">
              RESERVE <br /> <span className="text-primary">YOUR SPOT.</span>
            </h1>
            <p className="text-neutral-300 text-sm font-medium leading-relaxed max-w-[240px]">
              Join our community and access exclusive coastal experiences.
            </p>
          </div>

          <div className="space-y-6">
            <p className="text-white/50 text-xs font-bold uppercase tracking-widest">New here?</p>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-primary hover:text-white transition-all duration-500 group"
            >
              Create Account
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="p-8 md:p-14 bg-black/20">
          <div className="max-w-sm mx-auto space-y-8">
            <div className="space-y-2 text-center md:text-left">
              <h2 className="text-2xl font-black text-white tracking-tight">Sign In</h2>
              <p className="text-neutral-400 text-sm font-medium">Welcome back! Please enter your details.</p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                form.handleSubmit();
              }}
              className="space-y-5"
            >
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
                    <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 ml-1">Email Address</label>
                    <div className="relative group">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 group-focus-within:text-primary transition-colors" size={18} />
                      <input
                        {...field.state}
                        id={field.name}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        placeholder="name@company.com"
                        className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-all font-medium text-sm"
                      />
                    </div>
                    {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                      <motion.p initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="text-red-400 text-[10px] font-bold uppercase ml-1">
                        {field.state.meta.errors[0]}
                      </motion.p>
                    )}
                  </div>
                )}
              </form.Field>

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
                    <div className="flex justify-between items-center px-1">
                      <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Password</label>
                      <Link href="/forgot-password" className="text-[10px] font-black uppercase text-primary hover:underline">Forgot?</Link>
                    </div>
                    <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 group-focus-within:text-primary transition-colors" size={18} />
                      <input
                        {...field.state}
                        type={showPassword ? "text" : "password"}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        placeholder="••••••••"
                        className="w-full pl-12 pr-12 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-all font-medium text-sm"
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
                      <motion.p initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="text-red-400 text-[10px] font-bold uppercase ml-1">
                        {field.state.meta.errors[0]}
                      </motion.p>
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
                  {isPending ? "Verifying..." : "Sign In"}
                </Button>
              </div>

              <AnimatePresence>
                {serverError && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-center">
                    <p className="text-red-400 text-[11px] font-bold uppercase">{serverError}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="md:hidden text-center pt-4">
                <p className="text-neutral-500 text-xs font-medium">
                  Don't have an account?{" "}
                  <Link href="/register" className="text-primary font-black uppercase">Sign Up</Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;