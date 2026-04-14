"use client";
import React from "react";
import { Provider as ReduxProvider } from "react-redux";
import { persistor, store } from "../Redux/store";
import { Toaster } from "sonner";
import { PersistGate } from "redux-persist/integration/react";
import QueryProviders from "./QueryPeovider";

const Provider = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <ReduxProvider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <QueryProviders>
          <Toaster position="top-right" richColors />
          {children}
          </QueryProviders>
        </PersistGate>
      </ReduxProvider>
    </div>
  );
};

export default Provider;
