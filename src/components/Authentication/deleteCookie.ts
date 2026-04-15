"use server";

import { cookies } from "next/headers";

export const deleteCookies = async (keys: string[]) => {
  const cookieStore = await cookies();

  for (const key of keys) {
    //@ts-ignore
    cookieStore.delete(key);
  }
};
