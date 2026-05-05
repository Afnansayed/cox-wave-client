"use client";

import { useForm } from "@tanstack/react-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import Image from "next/image";
import {
  Ticket,
  Calendar,
  MapPin,
  ShieldCheck,
  CreditCard,
  ChevronRight,
  Info,
  ArrowLeft,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createBookingAction } from "@/app/(withCommonLayout)/booking/_action";
import { createBookingZodSchema } from "@/zod/booking.validation";
import { ICreateBookingPayload } from "@/types/booking.types";
import { getEventsById } from "@/app/(withCommonLayout)/event/_actions";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { cn } from "@/lib/utils";

const BookingForm = ({ defaultEventId, defaultGuestCount }: { defaultEventId: string; defaultGuestCount: number }) => {
  const [isRedirecting, setIsRedirecting] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["event", defaultEventId],
    queryFn: () => getEventsById(defaultEventId),
  });

  const event = data?.data;

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (payload: ICreateBookingPayload) =>
      createBookingAction(payload),
  });

  const initialValues = useMemo(
    () => ({
      event_id: defaultEventId,
      seats: defaultGuestCount,
    }),
    [defaultEventId, defaultGuestCount],
  );

  const form = useForm({
    defaultValues: initialValues,
    onSubmit: async ({ value }) => {
      const toastId = toast.loading("Securing your seats...");
      try {
        const res = await mutateAsync(value);
        if (res.success === false) {
          toast.error(res.message || "Booking failed", { id: toastId });
          return;
        }
        const paymentUrl = res.data?.paymentUrl;
        if (!paymentUrl) {
          toast.error("Payment gateway error", { id: toastId });
          return;
        }
        toast.success("Booking secured. Redirecting...", { id: toastId });
        setIsRedirecting(true);
        window.location.href = paymentUrl;
      } catch (error: any) {
        toast.error(error?.message || "An error occurred", { id: toastId });
      }
    },
  });

  if (isLoading) return <BookingSkeleton />;

  return (
    <div className=" bg-background  md:px-4">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Back Button */}
        <Link
          href={`/event/${defaultEventId}`}
          className="inline-flex items-center text-sm font-bold text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back to Event Details
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* LEFT: EVENT SUMMARY (2 Cols) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-card rounded-3xl border border-border overflow-hidden shadow-sm">
              <div className="relative aspect-video">
                <Image
                  src={event?.images?.[0] || "/placeholder.jpg"}
                  alt="Event"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <h1 className="text-xl font-black text-foreground leading-tight">
                    {event?.title}
                  </h1>
                  <p className="text-sm text-muted-foreground flex items-center mt-1">
                    <MapPin size={14} className="mr-1 text-primary" />{" "}
                    {event?.location}
                  </p>
                </div>

                <div className="pt-4 border-t border-border space-y-3">
                  <div className="flex justify-between text-sm font-medium">
                    <span className="text-muted-foreground">Price per seat</span>
                    <span className="text-foreground font-bold">
                      ৳{event?.per_person_price}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm font-medium">
                    <span className="text-muted-foreground">Available Seats</span>
                    <span className="text-secondary font-bold">
                      {event?.remaining_seats}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="p-6 bg-primary/5 rounded-3xl border border-primary/10 space-y-4">
              <div className="flex items-start gap-3">
                <ShieldCheck className="text-primary mt-1" size={18} />
                <div>
                  <p className="text-xs font-black uppercase tracking-wider text-primary">
                    Secure Transaction
                  </p>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    Your data is encrypted using SSL technology.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: BOOKING FORM (3 Cols) */}
          <div className="lg:col-span-3">
            <div className="bg-card rounded-[2rem] border border-border p-8 md:p-10 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.03)]">
              <div className="mb-8">
                <h2 className="text-2xl font-black text-foreground tracking-tight">
                  Complete Your Booking
                </h2>
                <p className="text-sm text-muted-foreground font-medium">
                  Enter your details to finalize the reservation.
                </p>
              </div>

              <form
                className="space-y-6"
                onSubmit={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  form.handleSubmit();
                }}
              >
                {/* Event ID (Read-Only Styled) */}
                <form.Field name="event_id">
                  {(field) => (
                    <div className="space-y-2 opacity-60">
                      <label className="text-[10px] font-black uppercase tracking-[0.1em] text-muted-foreground">
                        Reference Event ID
                      </label>
                      <Input
                        className="bg-muted border-border h-12 rounded-xl font-mono text-xs text-foreground"
                        value={field.state.value}
                        readOnly
                      />
                    </div>
                  )}
                </form.Field>

                {/* Seats Selection */}
                <form.Field
                  name="seats"
                  validators={{
                    onChange: ({ value }) => {
                      const result =
                        createBookingZodSchema.shape.seats.safeParse(value);
                      return result.success
                        ? undefined
                        : result.error.issues[0]?.message;
                    },
                  }}
                >
                  {(field) => (
                    <div className="space-y-3">
                      <div className="flex justify-between items-end">
                        <label className="text-sm font-bold text-foreground">
                          Number of Seats
                        </label>
                        {field.state.meta.errors.length > 0 && (
                          <span className="text-[10px] font-bold text-red-500 uppercase">
                            {field.state.meta.errors[0]}
                          </span>
                        )}
                      </div>
                      <div className="relative group">
                        <Ticket
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors"
                          size={18}
                        />
                        <Input
                          id={field.name}
                          type="number"
                          min={1}
                          max={event?.remaining_seats}
                          className="pl-12 h-14 rounded-2xl border-border focus:ring-primary focus:border-primary text-lg font-black bg-muted text-foreground"
                          value={String(field.state.value)}
                          onChange={(e) =>
                            field.handleChange(Number(e.target.value))
                          }
                          disabled={isPending || isRedirecting}
                        />
                      </div>
                    </div>
                  )}
                </form.Field>

                {/* Total Preview */}
                {/* 6. DYNAMIC TOTAL PREVIEW */}
                <form.Subscribe selector={(state) => [state.values.seats]}>
                  {([seats]) => {
                    const currentSeats = Number(seats) || 0;
                    const unitPrice = event?.per_person_price || 0;
                    const calculatedTotal = unitPrice * currentSeats;

                    return (
                      <div className="space-y-6">
                        {/* The Live Price Card */}
                        <div className="p-6 rounded-2xl bg-neutral-900 text-white relative overflow-hidden group">
                          {/* Subtle decorative glow */}
                          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[50px] rounded-full -mr-16 -mt-16 group-hover:bg-primary/20 transition-colors" />

                          <div className="relative z-10 space-y-4">
                            <div className="flex justify-between items-center border-b border-white/10 pb-3">
                              <div className="space-y-0.5">
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500">
                                  Total Investment
                                </p>
                                <p className="text-xs text-neutral-400 font-medium italic">
                                  ৳{unitPrice.toLocaleString()} × {currentSeats}{" "}
                                  {currentSeats === 1 ? "seat" : "seats"}
                                </p>
                              </div>
                              <CreditCard
                                size={20}
                                className="text-primary/80"
                              />
                            </div>

                            <div className="flex justify-between items-end">
                              <div>
                                <p className="text-4xl font-black tracking-tighter italic text-white">
                                  ৳{calculatedTotal.toLocaleString()}
                                </p>
                                <p className="text-[9px] font-bold text-green-400 uppercase tracking-widest mt-1">
                                  • Instant Confirmation Included
                                </p>
                              </div>

                              {/* Visual Seat Counter */}
                              <div className="bg-white/5 px-3 py-1 rounded-lg border border-white/5">
                                <span className="text-xs font-black text-primary uppercase leading-none">
                                  {currentSeats.toString().padStart(2, "0")}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* 7. ACTION BUTTON */}
                        <Button
                          type="submit"
                          disabled={
                            isPending || isRedirecting || currentSeats < 1
                          }
                          className={cn(
                            "w-full h-16 rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-xl transition-all duration-500 group",
                            currentSeats < 1
                              ? "bg-muted text-muted-foreground cursor-not-allowed shadow-none"
                              : "bg-primary hover:bg-primary/90 text-white shadow-primary/20",
                          )}
                        >
                          {isPending || isRedirecting ? (
                            <div className="flex items-center gap-3">
                              <div className="h-4 w-4 border-2 border-white/30 border-t-white animate-spin rounded-full" />
                              <span className="animate-pulse">
                                Processing...
                              </span>
                            </div>
                          ) : (
                            <span className="flex items-center gap-2">
                              Pay ৳{calculatedTotal.toLocaleString()}
                              <ChevronRight className="group-hover:translate-x-1 transition-transform" />
                            </span>
                          )}
                        </Button>
                      </div>
                    );
                  }}
                </form.Subscribe>

                <p className="text-[10px] text-center text-muted-foreground font-bold uppercase tracking-tighter">
                  By clicking, you agree to the Event Terms & Conditions
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const BookingSkeleton = () => (
  <div className="max-w-5xl mx-auto py-12 px-4 space-y-6">
    <Skeleton className="h-4 w-32" />
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
      <Skeleton className="lg:col-span-2 h-[400px] rounded-3xl" />
      <Skeleton className="lg:col-span-3 h-[500px] rounded-[2rem]" />
    </div>
  </div>
);

export default BookingForm;
