"use client";
import React, { useEffect, useState } from "react";
import { Dialog, DialogContent } from "../ui/dialog";
import Image from "next/image";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../ui/input-otp";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import { toast } from "sonner";
import {
  useResendVerifyOTPMutation,
  useVerifyOTPMutation,
} from "../Redux/RTK/authApi";
import { useAppDispatch } from "../Redux/hooks";
import { useRouter } from "next/navigation";
import { userLogin } from "./userLogin";
import { setToken, setUserInfo } from "../Redux/Slice/authSlice";

interface VerifyOtpModalProps {
  isOpen: boolean;
  onClose: () => void;
  loginData: { email: string; password: string } | null;
}

const VerifyOtpModal: React.FC<VerifyOtpModalProps> = ({
  isOpen,
  onClose,
  loginData,
}) => {
  const [value, setValue] = useState("");
  const [timer, setTimer] = useState(0);
  const [resendVerifyAuthOtp, { isLoading: resending }] =
    useResendVerifyOTPMutation();
  const [verifyAuthOtp, { isLoading }] = useVerifyOTPMutation();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [otpLoading, setLoading] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleResendOtp = async () => {
    const toastId = toast.loading("Resending OTP...");
    setValue("");
    setTimer(15);
    const resendData = {
      email: loginData?.email,
    };

    try {
      const response = await resendVerifyAuthOtp(resendData);
      console.log("OTP Responsive", response);
      if (response?.data?.status_code === 200) {
        toast.success(response?.data?.data?.message, {
          id: toastId,
          duration: 1000,
        });
      } else {
        toast.error(
          response?.data?.error?.errMsg || "OTP verification failed.",
          {
            id: toastId,
            duration: 1000,
          }
        );
      }
    } catch (err) {
      console.log(err);
      toast.error("Failed to verify OTP.", { id: toastId });
    }
  };

  const handleOtpChange = (otp: string) => {
    setValue(otp);
  };

  const handleVerifyOtp = async () => {
    const toastId = toast.loading("Verification Processing...");
    setLoading(true);
    if (!loginData?.email) {
      setLoading(false);
      toast.error("User email is missing.", { id: toastId });
      return;
    }

    if (!loginData) {
      setLoading(false);
      toast.error("Login data is missing.", { id: toastId });
      return;
    }
    const verifyData = {
      email: loginData.email,
      otp: value,
    };

    console.log("Verify Data", verifyData);
    try {
      const response = await verifyAuthOtp(verifyData);
      console.log("Verify Code  Response", response);
      if (response?.data?.status_code === 200) {
        toast.success(response?.data?.data?.message, {
          id: toastId,
          duration: 1000,
        });
        const res = await userLogin(loginData);
        if (res?.data.token) {
          const { token, user } = res?.data;
          dispatch(setToken({ accessToken: token }));
          dispatch(
            setUserInfo({
              email: user.email,
              name: user.name,
              category: user.category,
              email_verified: user.email_verified,
            })
          );
          toast.success("Login Successfully", { id: toastId, duration: 2000 });
          const redirectRoute = sessionStorage.getItem("redirect_to");
          if (redirectRoute) {
            router.push(JSON.parse(redirectRoute));
            return;
          }
          router.push("/dashboard");
          onClose();
          setLoading(true);
        } else {
          setLoading(false);
          toast.error("Something Went Wrong", { id: toastId, duration: 2000 });
        }
      } else {
        toast.error(response?.data?.error?.errMsg, {
          id: toastId,
          duration: 1000,
        });
        setLoading(false);
        console.log("Error Message Check", response?.data?.error?.errMsg);
      }
    } catch (err) {
      console.log(err);
      toast.error("Failed to verify OTP.", { id: toastId });
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen}>
      <DialogContent
        className="sm:max-w-[425px] opt-x"
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}

        // hideCloseButton
      >
        <div className=" flex flex-col justify-center items-center ">
          {timer > 0 ? (
            <div className="flex flex-col justify-center items-center">
              <Image
                src={"https://cdn-icons-png.flaticon.com/128/9731/9731748.png"}
                alt="Timer Icon"
                width={100}
                height={100}
                className="h-14 w-14"
              />
              <h1 className="text-center text-dark text-base font-medium">
                Wait {timer}s to resend.
              </h1>
            </div>
          ) : (
            <div className="flex flex-col justify-center items-center">
              <Image
                src={"https://cdn-icons-png.flaticon.com/128/9731/9731748.png"}
                alt="Enter OTP Icon"
                width={100}
                height={100}
                className="h-14 w-14"
              />
              <h1 className="text-center text-dark text-base font-medium">
                Enter OTP Code
              </h1>
            </div>
          )}
        </div>
        <div className="w-full h-16 flex flex-col justify-center items-center">
          <InputOTP
            maxLength={6}
            pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
            onChange={handleOtpChange}
            value={value}
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
          {timer === 0 && (
            <h1
              onClick={handleResendOtp}
              className="text-center text-base font-medium underline cursor-pointer"
            >
              Resend Code
            </h1>
          )}
        </div>

        <button
          disabled={isLoading || resending || otpLoading}
          onClick={handleVerifyOtp}
          className=" w-[60%] mx-auto bg-yellow-700 text-white text-sm py-2 px-6 rounded-full"
        >
          {isLoading || otpLoading ? "Verifying..." : "Verify Code"}
        </button>
      </DialogContent>
    </Dialog>
  );
};

export default VerifyOtpModal;
