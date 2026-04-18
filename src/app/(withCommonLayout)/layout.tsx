import Footer from "@/components/Common/Footer";
import Header from "@/components/Common/Header";
import React from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div >
      <Header />
      <div className="mt-[94px]">
          {children}
      </div>

      <Footer />
    </div>
  );
};

export default layout;
