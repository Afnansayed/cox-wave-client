'use server'
import { httpClient } from "@/lib/axios/httpClient";
import { ApiErrorResponse, ApiResponse } from "@/types/api.types";
import { IRegisterResponse } from "@/types/auth.types";
import { IRegisterPayload, registerZodSchema } from "@/zod/auth.validation";
import { AxiosError } from "axios";

export const registerAction = async (
  payload: IRegisterPayload
): Promise<ApiResponse<IRegisterResponse> | ApiErrorResponse> => {
  const parsedPayload = registerZodSchema.safeParse(payload);

  if (!parsedPayload.success) {
    const firstError = parsedPayload.error.issues[0].message || "Invalid input";
    return {
      success: false,
      message: firstError,
    };
  }

  try {
    const response = await httpClient.post<IRegisterResponse>(
      "/auth/register",
      parsedPayload.data
    );

    return response;
  } catch (error: unknown) {
    const axiosError = error as AxiosError<{ message?: string; error?: string }>;
    const serverMessage =
      axiosError.response?.data?.message ||
      axiosError.response?.data?.error ||
      axiosError.message ||
      "Registration failed";

    return {
      success: false,
      message: serverMessage,
    };
  }
};
