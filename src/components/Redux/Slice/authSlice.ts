import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

type TUserInfo = {
  email: string;
  name: string;
  category: string | null;
  email_verified: boolean;
};

type TAuthState = {
  accessToken: string | null;
  userInfo: TUserInfo | null;
};

const initialState: TAuthState = {
  accessToken: null,
  userInfo: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken: (state, action) => {
      const { accessToken } = action.payload;
      state.accessToken = accessToken;
    },
    setUserInfo: (state, action: PayloadAction<TUserInfo>) => {
      state.userInfo = action.payload;
    },
    logOut: () => initialState,
  },
});

export const { setToken, logOut, setUserInfo } = authSlice.actions;
export default authSlice.reducer;

export const useCurrentToken = (state: RootState) => state.auth.accessToken;
export const useCurrentUserInfo = (state: RootState) => state.auth.userInfo;
