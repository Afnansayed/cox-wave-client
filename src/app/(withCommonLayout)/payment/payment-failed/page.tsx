'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';

const PaymentFailedPage = () => {
  const [isOpen, setIsOpen] = useState(true);
  const router = useRouter();

  const closeModal = () => {
    router.push('/');
    setIsOpen(false);
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  useEffect(() => {
    setIsOpen(true);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="min-h-screen bg-[#f9f9f8]">
      <div
        className="flex justify-center items-center  bg-opacity-50 z-[1000] min-h-[100vh] pt-[20vh]"
        onClick={handleOverlayClick}
      >
        <div className="flex flex-col items-stretch w-[90%] sm:w-[80%] md:w-[60%] lg:w-[50%] max-w-[800px] h-auto m-4 p-4 bg-white rounded-md shadow-lg relative mt-6">
          {/* Form */}
          <div className="flex flex-col justify-center items-center p-4 bg-[#FFFFFF] text-[#263238] max-h-[68vh] 2xl:max-h-[78vh] ">
            <Image
              src="/module/payment/failed.svg"
              alt="logo"
              width={200}
              height={200}
              className="mx-auto mb-4"
            />
            <h2 className="mb-3 text-lg sm:text-xl md:text-2xl font-semibold text-center text-[#090C0D]">
              Opp! <br />
              Your Payment Was Failed!
            </h2>
            <p className="text-[#0835A8] text-sm sm:text-base text-center">
              Thank you for choosing our platform at your service.
            </p>

            <Link href={'/'}>
              <button
                className="bg-primary button-hover-one  py-2 px-4 text-sm sm:text-base md:text-lg text-white rounded-full mx-auto my-6"
                onClick={closeModal}
              >
                Back to Home
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailedPage;