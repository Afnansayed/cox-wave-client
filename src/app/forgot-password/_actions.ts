"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { ApiErrorResponse, ApiResponse } from "@/types/api.types";
import { IForgotPasswordResponse } from "@/types/auth.types";
import {
  forgotPasswordZodSchema,
  IForgotPasswordPayload,
} from "@/zod/auth.validation";
import { AxiosError } from "axios";

export const forgotPasswordAction = async (
  payload: IForgotPasswordPayload
): Promise<ApiResponse<IForgotPasswordResponse> | ApiErrorResponse> => {
  const parsedPayload = forgotPasswordZodSchema.safeParse(payload);

  if (!parsedPayload.success) {
    const firstError = parsedPayload.error.issues[0].message || "Invalid input";
    return {
      success: false,
      message: firstError,
    };
  }

  try {
    const response = await httpClient.post<IForgotPasswordResponse>(
      "/auth/forget-password",
      parsedPayload.data
    );

    return response;
  } catch (error: unknown) {
    const axiosError = error as AxiosError<{ message?: string; error?: string }>;
    const serverMessage =
      axiosError.response?.data?.message ||
      axiosError.response?.data?.error ||
      axiosError.message ||
      "Failed to send reset OTP";

    return {
      success: false,
      message: serverMessage,
    };
  }
};
