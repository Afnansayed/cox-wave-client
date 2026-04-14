import { baseApi } from "../baseApi";

const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    verifyOTP: builder.mutation({
      query: (data: any) => {
        return {
          url: "/verify-otp",
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["auth"],
    }),

    resendVerifyOTP: builder.mutation({
      query: (data: any) => ({
        url: "/resend/otp",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["auth"],
    }),
    sendPasswordResetEmail: builder.mutation({
      query: (data: any) => ({
        url: "/user/password/email",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["auth"],
    }),
    sendResetPassword: builder.mutation({
      query: (data: any) => ({
        url: "/user/password/reset",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["auth"],
    }),
    changePassword: builder.mutation({
      query: (data: any) => ({
        url: "/auth/user/change-password",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["auth"],
    }),
  }),
});

export const {
  useVerifyOTPMutation,
  useResendVerifyOTPMutation,
  useSendPasswordResetEmailMutation,
  useSendResetPasswordMutation,
  useChangePasswordMutation,
} = authApi;
