import {
  BaseQueryFn,
  createApi,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { RootState } from "./store";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { tagTypes } from "@/constants/tagTypes";

interface ErrorResponse {
  error?: {
    code?: number;
  };
  data?: any;
}

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.accessToken;
    if (token) {
      headers.set("authorization", `Bearer${token}`);
    }
    return headers;
  },
});

const baseQueryWithUnauthorizedHandler: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions);
  if ((result?.data as ErrorResponse)?.error?.code === 401) {
    const router: AppRouterInstance = (api.extra as any)?.router;
    console.log("Router", router);
    console.log("Unauthorized Check", result);
  }
  return result;
};

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: baseQueryWithUnauthorizedHandler,
  tagTypes: tagTypes,
  endpoints: () => ({}),
});
