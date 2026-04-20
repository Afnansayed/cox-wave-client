"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { updateBookingStatus } from "@/components/services/booking.services";
import { BookingStatus, IBookingDetailsData } from "@/types/booking.types";
import Link from "next/link";

type BookingDetailsCustomerProps = {
  booking: IBookingDetailsData;
};

const BookingDetailsCustomer = ({ booking }: BookingDetailsCustomerProps) => {
  const router = useRouter();
  const [currentStatus, setCurrentStatus] = useState<BookingStatus>(booking.status);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (nextStatus: BookingStatus) => updateBookingStatus(booking.id, nextStatus),
  });

  const handleStatusUpdate = async (nextStatus: BookingStatus) => {
    const toastId = toast.loading("Updating booking status...");

    try {
      const response = await mutateAsync(nextStatus);

      if (!response.success) {
        toast.error(response.message || "Failed to update booking status.", { id: toastId });
        return;
      }

      setCurrentStatus(nextStatus);
      toast.success(response.message || "Booking status updated successfully.", { id: toastId });
      router.refresh();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to update booking status.";
      toast.error(message, { id: toastId });
    }
  };

  const canUpdateStatus =
    currentStatus !== "CANCELLED" &&
    currentStatus !== "COMPLETED" &&
    currentStatus !== "PROCESSING";

  return (
    <section className="space-y-6">
        <div className="flex  gap-2 justify-end">
        {canUpdateStatus && (
          
            <Button
              type="button"
              size="sm"
              variant="destructive"
              disabled={isPending}
              onClick={() => handleStatusUpdate("CANCELLED")}
            >
              Cancel Booking
            </Button>
        )}
        <Button asChild variant="outline">
          <Link href="/customer-dashboard/booking">Back to Bookings</Link>
        </Button>
      </div>
      <div className="rounded-2xl border bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline">{currentStatus}</Badge>
          <Badge variant={booking.payment_status === "PAID" ? "default" : "secondary"}>
            {booking.payment_status}
          </Badge>
        </div>

        

        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <div>
            <p className="text-xs text-muted-foreground">Booking ID</p>
            <p className="font-medium break-all">{booking.id}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Seats</p>
            <p className="font-medium">{booking.seats}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Total Amount</p>
            <p className="font-medium">৳{booking.total_amount.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Event ID</p>
            <p className="font-medium break-all">{booking.event_id}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Created At</p>
            <p className="font-medium">{new Date(booking.createdAt).toLocaleString()}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Updated At</p>
            <p className="font-medium">{new Date(booking.updatedAt).toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold">Event Info</h2>

        {Array.isArray(booking.event?.images) && booking.event.images.length > 0 && (
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {booking.event.images.map((image, index) => (
              <div
                key={`${booking.event.id}-${index}`}
                className="overflow-hidden rounded-xl border bg-neutral-50"
              >
                <img
                  src={image}
                  alt={`${booking.event.title} image ${index + 1}`}
                  className="h-44 w-full object-cover"
                />
              </div>
            ))}
          </div>
        )}

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-xs text-muted-foreground">Title</p>
            <p className="font-medium">{booking.event?.title || "N/A"}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Location</p>
            <p className="font-medium">{booking.event?.location || "N/A"}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Per Person Price</p>
            <p className="font-medium">৳{booking.event?.per_person_price?.toLocaleString() || "0"}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Event Status</p>
            <p className="font-medium">{booking.event?.status || "N/A"}</p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold">Payment Info</h2>
        {booking.payment ? (
          <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <div>
              <p className="text-xs text-muted-foreground">Payment ID</p>
              <p className="font-medium break-all">{booking.payment.id}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Transaction ID</p>
              <p className="font-medium break-all">{booking.payment.transaction_id}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Payment Status</p>
              <p className="font-medium">{booking.payment.status}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Amount</p>
              <p className="font-medium">৳{booking.payment.amount.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Created At</p>
              <p className="font-medium">{new Date(booking.payment.createdAt).toLocaleString()}</p>
            </div>
          </div>
        ) : (
          <p className="mt-3 text-sm text-muted-foreground">No payment record found for this booking.</p>
        )}
      </div>
    </section>
  );
};

export default BookingDetailsCustomer;
