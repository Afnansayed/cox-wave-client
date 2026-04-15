"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { ApiErrorResponse, ApiResponse } from "@/types/api.types";
import { IResetPasswordResponse } from "@/types/auth.types";
import {
  IResetPasswordPayload,
  resetPasswordZodSchema,
} from "@/zod/auth.validation";
import { AxiosError } from "axios";

export const resetPasswordAction = async (
  payload: IResetPasswordPayload
): Promise<ApiResponse<IResetPasswordResponse> | ApiErrorResponse> => {
  const parsedPayload = resetPasswordZodSchema.safeParse(payload);

  if (!parsedPayload.success) {
    const firstError = parsedPayload.error.issues[0].message || "Invalid input";
    return {
      success: false,
      message: firstError,
    };
  }

  try {
    const response = await httpClient.post<IResetPasswordResponse>(
      "/auth/reset-password",
      parsedPayload.data
    );

    return response;
  } catch (error: unknown) {
    const axiosError = error as AxiosError<{ message?: string; error?: string }>;
    const serverMessage =
      axiosError.response?.data?.message ||
      axiosError.response?.data?.error ||
      axiosError.message ||
      "Failed to reset password";

    return {
      success: false,
      message: serverMessage,
    };
  }
};
