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
import { 
  ArrowLeft, 
  Calendar, 
  MapPin, 
  Users, 
  CreditCard, 
  Hash, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Ticket
} from "lucide-react";
import { cn } from "@/lib/utils";

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
      toast.success("Booking cancelled successfully.", { id: toastId });
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "An error occurred.", { id: toastId });
    }
  };

  const canCancel = ["PENDING", "CONFIRMED"].includes(currentStatus);

  return (
    <section className="container-max mx-auto space-y-6 md:space-y-8 p-4 md:p-0 animate-in fade-in duration-500">
      
      {/* --- HEADER ACTIONS --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start md:items-center gap-3 md:gap-4">
          <Button asChild variant="ghost" size="icon" className="rounded-full hover:bg-secondary/20 flex-shrink-0">
            <Link href="/customer-dashboard/booking">
              <ArrowLeft size={20} className="text-text-secondary" />
            </Link>
          </Button>
          <div className="min-w-0">
            <h1 className="text-2xl md:text-3xl font-black tracking-tighter text-text-primary truncate">Booking Details</h1>
            <div className="flex items-center gap-2 text-text-secondary font-mono text-[10px] md:text-xs mt-1 bg-secondary/5 px-2 py-0.5 rounded w-fit">
              <Hash size={12} className="text-primary flex-shrink-0" />
              <span className="truncate max-w-[150px] md:max-w-none">{booking.id.toUpperCase()}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          {canCancel && (
            <Button
              variant="destructive"
              disabled={isPending}
              onClick={() => handleStatusUpdate("CANCELLED")}
              className="flex-1 md:flex-none rounded-xl font-black text-[10px] uppercase tracking-widest px-4 md:px-6 h-11"
            >
              {isPending ? "..." : "Cancel"}
            </Button>
          )}
          <Button asChild variant="outline" className="flex-1 md:flex-none rounded-xl border-secondary/20 h-11 font-black text-[10px] uppercase tracking-widest">
            <Link href="/customer-dashboard/booking">Back</Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        
        {/* --- LEFT COLUMN: EVENT & CONTENT --- */}
        <div className="lg:col-span-2 space-y-6 md:space-y-8">
          
          {/* Main Event Card */}
          <div className="bg-white rounded-[1.5rem] md:rounded-[2.5rem] border border-secondary/10 overflow-hidden shadow-sm">
            <div className="p-5 md:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="space-y-2">
                  <Badge className="bg-primary/10 text-primary hover:bg-primary/10 border-none px-3 py-1 font-black uppercase text-[9px] tracking-widest">
                    Reserved Event
                  </Badge>
                  <h2 className="text-xl md:text-2xl font-black text-text-primary leading-tight">
                    {booking.event?.title || "Event Information Unavailable"}
                  </h2>
                </div>
                <div className="flex flex-row sm:flex-col gap-2 items-center sm:items-end justify-between sm:justify-start bg-secondary/5 sm:bg-transparent p-3 sm:p-0 rounded-xl sm:rounded-none">
                  <div className="flex flex-col items-start sm:items-end">
                    <Badge className={cn(
                        "rounded-lg font-black uppercase px-3 md:px-4 py-1.5 md:py-2 text-[9px] md:text-[10px] tracking-widest",
                        currentStatus === "CANCELLED" ? "bg-rose-500 text-white" : 
                        currentStatus === "CONFIRMED" ? "bg-primary text-white" : "bg-secondary text-text-primary"
                    )}>
                        {currentStatus}
                    </Badge>
                    <span className="text-[9px] font-black text-text-secondary uppercase tracking-widest mt-1 hidden sm:block">Status</span>
                  </div>
                </div>
              </div>

              {/* Event Images */}
              {Array.isArray(booking.event?.images) && booking.event.images.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                  {booking.event.images.slice(0, 2).map((image, index) => (
                    <div key={index} className="aspect-[16/10] sm:aspect-video rounded-xl md:rounded-2xl overflow-hidden border border-secondary/5 group">
                      <img
                        src={image}
                        alt="Event"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Event Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 pt-2 md:pt-4">
                <div className="flex items-center sm:block gap-4 bg-secondary/5 sm:bg-transparent p-3 sm:p-0 rounded-xl sm:rounded-none">
                  <div className="flex items-center gap-1.5 text-primary">
                    <MapPin size={14} className="flex-shrink-0" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-text-secondary">Location</span>
                  </div>
                  <p className="font-bold text-text-primary text-sm sm:pl-5 truncate">{booking.event?.location || "N/A"}</p>
                </div>
                <div className="flex items-center sm:block gap-4 bg-secondary/5 sm:bg-transparent p-3 sm:p-0 rounded-xl sm:rounded-none">
                  <div className="flex items-center gap-1.5 text-primary">
                    <Users size={14} className="flex-shrink-0" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-text-secondary">Guests</span>
                  </div>
                  <p className="font-bold text-text-primary text-sm sm:pl-5">{booking.seats} Seats</p>
                </div>
                <div className="flex items-center sm:block gap-4 bg-secondary/5 sm:bg-transparent p-3 sm:p-0 rounded-xl sm:rounded-none">
                  <div className="flex items-center gap-1.5 text-primary">
                    <Ticket size={14} className="flex-shrink-0" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-text-secondary">Unit Price</span>
                  </div>
                  <p className="font-bold text-text-primary text-sm sm:pl-5">৳{booking.event?.per_person_price?.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Financial Summary */}
          <div className="bg-white rounded-[1.5rem] md:rounded-[2.5rem] border border-secondary/10 p-5 md:p-8 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 md:mb-8">
              <h3 className="text-base md:text-lg font-black text-text-primary uppercase tracking-tighter flex items-center gap-2">
                <CreditCard size={20} className="text-primary flex-shrink-0" />
                Payment Summary
              </h3>
              <Badge variant={booking.payment_status === "PAID" ? "default" : "secondary"} className="w-fit rounded-md px-3 font-black text-[9px] md:text-[10px] uppercase tracking-widest">
                {booking.payment_status}
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              <div className="bg-secondary/5 rounded-2xl p-5 md:p-6 border border-secondary/10 flex flex-col justify-center">
                <p className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em] mb-1">Total Paid</p>
                <p className="text-3xl md:text-4xl font-black text-text-primary tracking-tighter">৳{booking.total_amount.toLocaleString()}</p>
              </div>

              {booking.payment && (
                <div className="space-y-3 md:space-y-4">
                  <div className="flex justify-between items-center text-xs md:text-sm border-b border-secondary/5 pb-2">
                    <span className="text-text-secondary font-medium">Transaction ID</span>
                    <span className="font-mono font-bold text-text-primary truncate ml-4">{booking.payment.transaction_id}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs md:text-sm border-b border-secondary/5 pb-2">
                    <span className="text-text-secondary font-medium">Method</span>
                    <span className="font-bold text-text-primary flex items-center gap-1.5">
                      <CheckCircle2 size={14} className="text-emerald-500 flex-shrink-0" /> Digital
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs md:text-sm">
                    <span className="text-text-secondary font-medium">Paid On</span>
                    <span className="font-bold text-text-primary">{new Date(booking.payment.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* --- RIGHT COLUMN: TIMELINE & METADATA --- */}
        <div className="space-y-6 md:space-y-8">
          <div className="bg-white rounded-[1.5rem] md:rounded-[2.5rem] border border-secondary/10 p-6 md:p-8 shadow-sm">
            <h3 className="text-base md:text-lg font-black text-text-primary uppercase tracking-tighter flex items-center gap-2 mb-6 md:mb-8">
              <Clock size={20} className="text-primary flex-shrink-0" />
              Timeline
            </h3>
            
            <div className="space-y-6 md:space-y-8 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[2px] before:bg-secondary/10">
              <div className="relative pl-8">
                <div className="absolute left-0 top-1 w-4 h-4 rounded-full bg-primary border-4 border-white shadow-sm" />
                <p className="text-[10px] font-black text-text-secondary uppercase tracking-widest">Created On</p>
                <p className="text-xs md:text-sm font-bold text-text-primary">{new Date(booking.createdAt).toLocaleString()}</p>
              </div>
              <div className="relative pl-8">
                <div className="absolute left-0 top-1 w-4 h-4 rounded-full bg-secondary border-4 border-white shadow-sm" />
                <p className="text-[10px] font-black text-text-secondary uppercase tracking-widest">Last Activity</p>
                <p className="text-xs md:text-sm font-bold text-text-primary">{new Date(booking.updatedAt).toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-primary/5 rounded-2xl md:rounded-[2rem] border border-primary/10 p-5 md:p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="text-primary flex-shrink-0 mt-0.5" size={18} />
              <div className="space-y-1">
                <h4 className="font-black text-[10px] uppercase tracking-[0.2em] text-primary">Need Help?</h4>
                <p className="text-[11px] text-text-secondary leading-relaxed font-medium">
                  Modifications are restricted for processed bookings. Contact support for assistance.
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default BookingDetailsCustomer;