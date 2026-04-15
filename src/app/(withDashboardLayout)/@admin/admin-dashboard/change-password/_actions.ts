"use server";

import { getCookie } from "@/lib/cookie.utils";
import { httpClient } from "@/lib/axios/httpClient";
import { ApiErrorResponse, ApiResponse } from "@/types/api.types";
import { IChangePasswordResponse } from "@/types/auth.types";
import {
  changePasswordZodSchema,
  IChangePasswordPayload,
} from "@/zod/auth.validation";
import { AxiosError } from "axios";

export const changePasswordAction = async (
  payload: IChangePasswordPayload
): Promise<ApiResponse<IChangePasswordResponse> | ApiErrorResponse> => {
  const parsedPayload = changePasswordZodSchema.safeParse(payload);

  if (!parsedPayload.success) {
    const firstError = parsedPayload.error.issues[0].message || "Invalid input";
    return {
      success: false,
      message: firstError,
    };
  }

  try {
    const response = await httpClient.post<IChangePasswordResponse>(
      "/auth/change-password",
      parsedPayload.data
    );

    return response;
  } catch (error: unknown) {
    const axiosError = error as AxiosError<{ message?: string; error?: string }>;
    const serverMessage =
      axiosError.response?.data?.message ||
      axiosError.response?.data?.error ||
      axiosError.message ||
      "Failed to change password";

    return {
      success: false,
      message: serverMessage,
    };
  }
};
