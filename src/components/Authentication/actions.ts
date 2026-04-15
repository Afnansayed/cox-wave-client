'use server'
import { httpClient } from "@/lib/axios/httpClient";
import { ApiErrorResponse, ApiResponse } from "@/types/api.types";
import {  IVerifyOtpPayload, IVerifyOtpResponse } from "@/types/auth.types";
import { verifyOtpZodSchema } from "@/zod/auth.validation";
import { AxiosError } from "axios";



export const verifyAction = async (payload : IVerifyOtpPayload ) : Promise<ApiResponse<IVerifyOtpResponse> | ApiErrorResponse> =>{
    const parsedPayload = verifyOtpZodSchema.safeParse(payload);

    if(!parsedPayload.success){
        const firstError = parsedPayload.error.issues[0].message || "Invalid input";
        return {
            success: false,
            message: firstError,
        }
    }
    try {

        const response = await httpClient.post<IVerifyOtpResponse>("/auth/verify-email", parsedPayload.data);
        console.log(response.data);

        const { token , user} = response.data;
        return response;
        
    } catch (error : unknown) {
        const axiosError = error as AxiosError<{ message?: string; error?: string }>;
        const serverMessage =
            axiosError.response?.data?.message ||
            axiosError.response?.data?.error ||
            axiosError.message ||
            "Login failed";

        return {
            success: false,
            message: serverMessage,
        }
    }
} 



