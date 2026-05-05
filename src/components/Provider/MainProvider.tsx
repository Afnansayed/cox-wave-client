"use client";
import React from "react";
import { Provider as ReduxProvider } from "react-redux";
import { persistor, store } from "../Redux/store";
import { Toaster } from "sonner";
import { PersistGate } from "redux-persist/integration/react";
import QueryProviders from "./QueryPeovider";
import { ThemeProvider } from "./Theme-Provider";

const Provider = ({ children }: { children: React.ReactNode }) => {
  return (
    <ReduxProvider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProviders>
            <Toaster position="top-right" richColors />
            {children}
          </QueryProviders>
        </ThemeProvider>
      </PersistGate>
    </ReduxProvider>
  );
};

export default Provider;
