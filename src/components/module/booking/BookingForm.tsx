"use client";

import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createBookingAction } from "@/app/(withCommonLayout)/booking/_action";
import { createBookingZodSchema } from "@/zod/booking.validation";
import { ICreateBookingPayload } from "@/types/booking.types";

const BookingForm = ({ defaultEventId }: { defaultEventId: string }) => {
  const [isRedirecting, setIsRedirecting] = useState(false);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (payload: ICreateBookingPayload) => createBookingAction(payload),
  });

  const initialValues = useMemo(
    () => ({
      event_id: defaultEventId,
      seats: 1,
    }),
    [defaultEventId],
  );

  const form = useForm({
    defaultValues: initialValues,
    onSubmit: async ({ value }) => {
      const toastId = toast.loading("Creating booking...");

      try {
        const res = await mutateAsync(value);

        if (res.success === false) {
          toast.error(res.message || "Booking failed", { id: toastId });
          return;
        }

        const paymentUrl = res.data?.paymentUrl;

        if (!paymentUrl) {
          toast.error("Payment URL not found in response", { id: toastId });
          return;
        }

        toast.success("Booking created. Redirecting to payment...", { id: toastId });
        setIsRedirecting(true);
        window.location.href = paymentUrl;
      } catch (error: any) {
        toast.error(error?.message || "Booking failed", { id: toastId });
      }
    },
  });

  return (
    <div className="w-full max-w-xl rounded-2xl border bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-neutral-900">Create Booking</h2>
      <p className="mt-1 text-sm text-neutral-600">
        Confirm your event id and choose seats to proceed to payment.
      </p>

      <form
        className="mt-6 space-y-5"
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <form.Field
          name="event_id"
          validators={{
            onChange: ({ value }) => {
              const result = createBookingZodSchema.shape.event_id.safeParse(value);
              return result.success ? undefined : result.error.issues[0]?.message;
            },
          }}
        >
          {(field) => (
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-800" htmlFor={field.name}>
                Event ID
              </label>
              <Input
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="Enter event id"
                disabled={isPending || isRedirecting}
              />
              {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                <p className="text-xs text-red-500">{field.state.meta.errors.join(", ")}</p>
              )}
            </div>
          )}
        </form.Field>

        <form.Field
          name="seats"
          validators={{
            onChange: ({ value }) => {
              const result = createBookingZodSchema.shape.seats.safeParse(value);
              return result.success ? undefined : result.error.issues[0]?.message;
            },
          }}
        >
          {(field) => (
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-800" htmlFor={field.name}>
                Seats
              </label>
              <Input
                id={field.name}
                name={field.name}
                type="number"
                min={1}
                value={String(field.state.value)}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(Number(e.target.value))}
                placeholder="Enter seats"
                disabled={isPending || isRedirecting}
              />
              {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                <p className="text-xs text-red-500">{field.state.meta.errors.join(", ")}</p>
              )}
            </div>
          )}
        </form.Field>

        <Button
          type="submit"
          disabled={isPending || isRedirecting}
          className="w-full h-11 font-semibold"
        >
          {isPending || isRedirecting ? "Processing..." : "Confirm Booking"}
        </Button>
      </form>
    </div>
  );
};

export default BookingForm;
