'use server';

import { AxiosError } from 'axios';
import { httpClient } from '@/lib/axios/httpClient';
import { ApiErrorResponse, ApiResponse } from '@/types/api.types';
import {
  ICreateBookingPayload,
  ICreateBookingResponse,
} from '@/types/booking.types';
import { createBookingZodSchema } from '@/zod/booking.validation';

export const createBookingAction = async (
  payload: ICreateBookingPayload,
): Promise<ApiResponse<ICreateBookingResponse> | ApiErrorResponse> => {
  const parsedPayload = createBookingZodSchema.safeParse(payload);

  if (!parsedPayload.success) {
    return {
      success: false,
      message: parsedPayload.error.issues[0]?.message || 'Invalid input',
    };
  }

  try {
    // Update endpoint here if your backend route differs.
    const response = await httpClient.post<ICreateBookingResponse>(
      '/booking',
      parsedPayload.data,
    );

    return response;
  } catch (error: unknown) {
    const axiosError = error as AxiosError<{ message?: string; error?: string }>;

    return {
      success: false,
      message:
        axiosError.response?.data?.message ||
        axiosError.response?.data?.error ||
        axiosError.message ||
        'Booking failed',
    };
  }
};
