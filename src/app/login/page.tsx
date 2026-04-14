"use client";

import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { userLogin } from "@/components/Authentication/userLogin";
import { toast } from "sonner";
import { setToken, setUserInfo } from "@/components/Redux/Slice/authSlice";
import { useAppDispatch } from "@/components/Redux/hooks";
import { useRouter } from "next/navigation";
import VerifyOtpModal from "@/components/Authentication/VerifyOtpModal";

interface LoginFormInputs {
  email: string;
  password: string;
}

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isVerifyModal, setVerifyModal] = useState(false);
  const closeModal = () => setVerifyModal(false);
  const [loading, setLoading] = useState(false);
  const [loginData, setLoginData] = useState<{
    email: string;
    password: string;
  } | null>(null);

  const dispatch = useAppDispatch();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LoginFormInputs>();

  const onSubmit = async (data: LoginFormInputs) => {
    setLoading(true);
    const toastId = toast.loading("Login Processing !");
    setLoginData({
      email: data.email,
      password: data.password,
    });

    try {
      const res = await userLogin(data);
      if (res?.data?.user?.email_verified === false) {
        toast.success("OTP sent! Please verify.", { id: toastId });
        reset();
        setLoading(false);
        setVerifyModal(true);
      } else if (res?.data?.user?.email_verified === true) {
        const { user, token } = res?.data;
        dispatch(setToken({ accessToken: token }));
        dispatch(
          setUserInfo({
            email: user.email,
            name: user.name,
            category: user.category,
            email_verified: user.email_verified,
          })
        );
        reset();
        toast.success("Login Successfully", { id: toastId, duration: 2000 });
        const redirectRoute = sessionStorage.getItem("redirect_to");
        if (redirectRoute) {
          router.push(JSON.parse(redirectRoute));
          return;
        }
        setLoading(false);
        router.push("/dashboard");
      } else {
        toast.error(res?.data?.message || "Valid Information Provide!", {
          id: toastId,
          duration: 2000,
        });
        setLoading(false);
      }
    } catch (err) {
      console.error("Error:", "Something went wrong");
      setLoading(false);
    }
  };

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
        <div className="hidden md:block  p-12">
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
        <div className=" p-8 md:p-12">
          <div className="w-full max-w-sm mx-auto space-y-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <label className="uppercase text-sm font-medium text-white/80">
                  Email *
                </label>
                <input
                  {...register("email", {
                    required: "Email is required",
                  })}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-md
                           text-white placeholder:text-white/50
                           focus:outline-none focus:border-white/40"
                  placeholder="Email"
                />
                {errors.email && (
                  <p className="text-red-400 text-sm">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="uppercase text-sm font-medium text-white/80">
                  Password *
                </label>
                <div className="relative">
                  <input
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 8,
                        message: "Password must be at least 8 characters long",
                      },
                    })}
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
                    {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-400 text-sm">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="">
                <button
                  type="button"
                  className="text-sm text-white/80 hover:text-white"
                >
                  Forgot Password?
                </button>
              </div>

              <button
                disabled={loading}
                type="submit"
                className="w-full py-2 px-4 bg-[#c48200] text-white rounded-md
                          transition-colors
                         focus:outline-none focus:bg-none focus:none focus:ring-offset-2"
              >
                {loading ? "Loading..." : "Sign In"}
              </button>
              <div className="relative flex items-center justify-center">
                <span className="absolute bg-white/20 w-full h-px" />
                <span className="bg-transparent px-4 text-white">or</span>
              </div>
            </form>

            <>
              {/* Google Sign-In Button */}
              <button
                type="button"
                className="w-full flex items-center justify-center py-2 px-4 bg-white/10 border border-white/20 text-white rounded-md"
              >
                <img
                  src="https://cdn-icons-png.flaticon.com/128/300/300221.png"
                  alt="Google"
                  className="w-5 h-5 mr-2"
                />
                Sign In with Google
              </button>
            </>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
