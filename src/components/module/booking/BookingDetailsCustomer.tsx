"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { updateBookingStatus } from "@/components/services/booking.services";
import { BookingStatus, IBookingDetailsData } from "@/types/booking.types";
import { Roles } from "@/constants/role.type";
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
  Ticket,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";

type BookingDetailsCustomerProps = {
  booking: IBookingDetailsData;
  basePath?: string;
  role?: (typeof Roles)[keyof typeof Roles];
};

const BookingDetailsCustomer = ({
  booking,
  basePath = "/customer-dashboard/booking",
  role = Roles.customer,
}: BookingDetailsCustomerProps) => {
  const router = useRouter();
  const [currentStatus, setCurrentStatus] = useState<BookingStatus>(booking.status);
  const [selectedStatus, setSelectedStatus] = useState<BookingStatus>(booking.status);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);

  const isCustomer = role === Roles.customer;
  const isOwnerOrAdmin = role === Roles.owner || role === Roles.admin;

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
      setSelectedStatus(nextStatus);
      setIsStatusModalOpen(false);
      toast.success(response.message || "Booking status updated successfully.", { id: toastId });
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "An error occurred.", { id: toastId });
    }
  };

  const canCancelAsCustomer =
    isCustomer && ["PENDING", "CONFIRMED"].includes(currentStatus);

  const canOpenStatusModal =
    isOwnerOrAdmin && currentStatus !== "CANCELLED" && currentStatus !== "COMPLETED";

  const ownerAdminStatusOptions: BookingStatus[] = [
    "PENDING",
    "PROCESSING",
    "CONFIRMED",
    "CANCELLED",
    "COMPLETED",
  ];

  return (
    <div className="w-full  mx-auto space-y-8 pb-10">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="flex items-center gap-4">
          <Button asChild variant="outline" size="icon" className="rounded-xl border-slate-200 h-10 w-10 shrink-0">
            <Link href={basePath}>
              <ArrowLeft size={18} className="text-slate-600" />
            </Link>
          </Button>
          <div className="space-y-0.5">
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-slate-900">Booking Details</h1>
            <div className="flex items-center gap-2 text-slate-500 font-mono text-xs">
              <Hash size={14} className="text-slate-400" />
              <span>{booking.id.toUpperCase()}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {canCancelAsCustomer && (
            <Button
              variant="outline"
              disabled={isPending}
              onClick={() => handleStatusUpdate("CANCELLED")}
              className="rounded-xl px-6 h-10 text-xs font-medium border-rose-200 text-rose-600 hover:bg-rose-50"
            >
              Cancel Booking
            </Button>
          )}

          {canOpenStatusModal && (
            <Dialog open={isStatusModalOpen} onOpenChange={setIsStatusModalOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="default"
                  disabled={isPending}
                  className="rounded-xl px-6 h-10 text-xs font-medium bg-primary text-white hover:bg-primary/90"
                >
                  Change Status
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md rounded-2xl border-slate-200">
                <DialogHeader>
                  <DialogTitle className="text-lg font-semibold">Update Status</DialogTitle>
                  <DialogDescription className="text-sm">
                    Move the booking to a different state.
                  </DialogDescription>
                </DialogHeader>

                <div className="py-4 space-y-2">
                  <label className="text-xs font-medium text-slate-500">Target State</label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value as BookingStatus)}
                    className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm font-medium focus:ring-2 focus:ring-primary/10 outline-none"
                    disabled={isPending}
                  >
                    {ownerAdminStatusOptions.map((status) => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>

                <DialogFooter className="gap-2">
                  <Button variant="ghost" onClick={() => setIsStatusModalOpen(false)} disabled={isPending}>Cancel</Button>
                  <Button onClick={() => handleStatusUpdate(selectedStatus)} disabled={isPending || selectedStatus === currentStatus}>
                    {isPending ? "Saving..." : "Save Changes"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* --- LEFT CONTENT (8 cols) --- */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Main Card */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-6 md:p-8 space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="space-y-2">
                  <Badge variant="secondary" className="bg-primary/5 text-primary border-none px-3 py-1 font-medium text-[11px] rounded-lg">
                    Reserved Event
                  </Badge>
                  <h2 className="text-2xl font-semibold text-slate-900 leading-tight">
                    {booking.event?.title || "Unknown Event"}
                  </h2>
                </div>
                <div className="flex flex-col sm:items-end gap-1">
                  <Badge className={cn(
                      "rounded-lg font-semibold px-4 py-1.5 text-[11px] tracking-wide",
                      currentStatus === "CANCELLED" ? "bg-rose-50 text-rose-600 border-rose-100" : 
                      currentStatus === "CONFIRMED" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-slate-50 text-slate-600 border-slate-100"
                  )}>
                      {currentStatus}
                  </Badge>
                  <span className="text-[10px] text-slate-400 font-medium px-1">Booking Status</span>
                </div>
              </div>

              {/* Images */}
              {Array.isArray(booking.event?.images) && booking.event.images.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {booking.event.images.slice(0, 2).map((image, index) => (
                    <div key={index} className="aspect-[16/9] rounded-2xl overflow-hidden border border-slate-50">
                      <img src={image} alt="Event" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              )}

              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <MapPin size={14} />
                    <span className="text-[11px] font-medium uppercase tracking-wider">Location</span>
                  </div>
                  <p className="font-medium text-slate-700 text-sm">{booking.event?.location || "TBD"}</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <Users size={14} />
                    <span className="text-[11px] font-medium uppercase tracking-wider">Capacity</span>
                  </div>
                  <p className="font-medium text-slate-700 text-sm">{booking.seats} Seats Booked</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <Ticket size={14} />
                    <span className="text-[11px] font-medium uppercase tracking-wider">Price per Seat</span>
                  </div>
                  <p className="font-medium text-slate-700 text-sm">৳{booking.event?.per_person_price?.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Financials */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <CreditCard size={20} className="text-primary" />
                Payment Summary
              </h3>
              <Badge className={cn(
                "rounded-md px-3 font-medium text-[11px]",
                booking.payment_status === "PAID" ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
              )}>
                {booking.payment_status}
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              <div className="md:col-span-5 bg-slate-50 rounded-2xl p-6 border border-slate-100 flex flex-col justify-center">
                <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider mb-1">Total Paid</p>
                <p className="text-3xl font-bold text-slate-900 tracking-tight">৳{booking.total_amount.toLocaleString()}</p>
              </div>

              <div className="md:col-span-7 space-y-4">
                {booking.payment ? (
                  <>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-500">Transaction ID</span>
                      <span className="font-mono text-slate-900 font-medium">{booking.payment.transaction_id}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-500">Paid On</span>
                      <span className="font-medium text-slate-900">{new Date(booking.payment.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}</span>
                    </div>
                  </>
                ) : (
                  <p className="text-sm text-slate-400 italic">No transaction records found.</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* --- RIGHT SIDEBAR (4 cols) --- */}
        <div className="lg:col-span-4 space-y-8">
          
          <div className="bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2 mb-8">
              <Clock size={20} className="text-slate-400" />
              Timeline
            </h3>
            
            <div className="space-y-8 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[1px] before:bg-slate-100">
              <div className="relative pl-8">
                <div className="absolute left-0 top-1.5 w-4 h-4 rounded-full bg-slate-900 border-4 border-white shadow-sm" />
                <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Created</p>
                <p className="text-sm font-semibold text-slate-900">{new Date(booking.createdAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}</p>
              </div>
              <div className="relative pl-8">
                <div className="absolute left-0 top-1.5 w-4 h-4 rounded-full bg-slate-200 border-4 border-white shadow-sm" />
                <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Updated</p>
                <p className="text-sm font-semibold text-slate-900">{new Date(booking.updatedAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 rounded-2xl border border-slate-100 p-6">
            <div className="flex gap-3">
              <AlertCircle className="text-slate-400 shrink-0" size={18} />
              <div className="space-y-1">
                <h4 className="font-semibold text-xs text-slate-900">Need Help?</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Modifications are restricted once an event is processed. If you need to make changes, please contact support.
                </p>
                <Button variant="link" className="p-0 h-auto text-xs text-primary font-semibold">
                  Contact Support <ChevronRight size={12} />
                </Button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default BookingDetailsCustomer;