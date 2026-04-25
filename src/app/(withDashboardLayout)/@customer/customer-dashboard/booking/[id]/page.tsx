import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { getBookingById } from "@/components/services/booking.services";
import BookingDetailsCustomer from "@/components/module/booking/BookingDetailsCustomer";
import { Roles } from "@/constants/role.type";



const BookingDetailsPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;

  const response = await getBookingById(id);

  if (!response.success || !response.data) {
    notFound();
  }

  const booking = response?.data;

  return (
    <section className="space-y-4 p-4">
      <BookingDetailsCustomer booking={booking} role={Roles.customer} />
    </section>
  );
};

export default BookingDetailsPage;
