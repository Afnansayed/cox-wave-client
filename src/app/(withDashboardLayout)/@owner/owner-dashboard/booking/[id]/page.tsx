import { notFound } from "next/navigation";
import BookingDetailsCustomer from "@/components/module/booking/BookingDetailsCustomer";
import { getBookingById } from "@/components/services/booking.services";
import { Roles } from "@/constants/role.type";

const OwnerBookingDetailsPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;

  const response = await getBookingById(id);

  if (!response.success || !response.data) {
    notFound();
  }

  return (
    <BookingDetailsCustomer
      booking={response.data}
      basePath="/owner-dashboard/booking"
      role={Roles.owner}
    />
  );
};

export default OwnerBookingDetailsPage;
