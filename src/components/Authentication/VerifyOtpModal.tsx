"use client";
import React, { useEffect, useState } from "react";
import { Dialog, DialogContent } from "../ui/dialog";
import Image from "next/image";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../ui/input-otp";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { verifyAction } from "./actions";

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

    // console.log("Verify Data", verifyData);

    try {
      const response = await verifyAction(verifyData);
      //console.log("Verify Code  Response", response);
      if (!("data" in response)) {
        toast.error(response.message || "OTP verification failed.", {
          id: toastId,
          duration: 1000,
        });
        setLoading(false);
        return;
      }

      if (response.data?.token) {
        toast.success(response?.message || "Email verified successfully", {
          id: toastId,
          duration: 1000,
        });

        router.push("/login");
        onClose();
        setLoading(false);
      } else {
        toast.error(response.message || "OTP verification failed.", {
          id: toastId,
          duration: 1000,
        });
        setLoading(false);
        console.log("Error Message Check", response.message);
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
        </div>

        <button
          disabled={otpLoading}
          onClick={handleVerifyOtp}
          className=" w-[60%] mx-auto bg-primary text-white text-sm py-2 px-6 rounded-full"
        >
          {otpLoading ? "Verifying..." : "Verify Code"}
        </button>
      </DialogContent>
    </Dialog>
  );
};

export default VerifyOtpModal;
