"use server";

import { deleteCookies } from "./deleteCookie";
import { accessTokenKey, betterKey, refreshTokenKey } from "./authKey";

export const logoutUser = async () => {
  await deleteCookies([betterKey , accessTokenKey, refreshTokenKey]);
};
