import { z } from "zod";

export const loginZodSchema = z.object({
    email : z.email("Invalid email address"),
    password : z.string()
        .min(1, "Password is required")
        .min(8, "Password must be at least 8 characters long")
})

export const registerZodSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.email("Invalid email address"),
    password: z.string()
        .min(1, "Password is required")
        .min(8, "Password must be at least 8 characters long")
})

export const verifyOtpZodSchema = z.object({
    email : z.email("Invalid email address"),
    otp : z.string().length(6, "OTP must be 6 characters long")
})




export type ILoginPayload = z.infer<typeof loginZodSchema>;
export type IRegisterPayload = z.infer<typeof registerZodSchema>;
export type IVerifyOtpPayload = z.infer<typeof verifyOtpZodSchema>;