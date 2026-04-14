"use server";
import { FieldValues } from "react-hook-form";
import { cookies } from "next/headers";
import { authKey } from "./authKey";

export const userLogin = async (formData: FieldValues) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/user/login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    }
  );
  const userInfo = await res.json();

  if (userInfo.data.token && userInfo.data?.user?.email_verified) {
    (await cookies()).set(authKey, userInfo.data.token);
  }
  return userInfo;
};
