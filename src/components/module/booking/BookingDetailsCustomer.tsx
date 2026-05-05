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
  const [currentStatus, setCurrentStatus] = useState<BookingStatus>(booking?.status);
  const [selectedStatus, setSelectedStatus] = useState<BookingStatus>(booking?.status);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);

  const isCustomer = role === Roles.customer;
  const isOwnerOrAdmin = role === Roles.owner || role === Roles.admin;

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (nextStatus: BookingStatus) => updateBookingStatus(booking?.id, nextStatus),
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
          <Button asChild variant="outline" size="icon" className="rounded-xl border-border h-10 w-10 shrink-0 bg-background shadow-sm">
            <Link href={basePath}>
              <ArrowLeft size={18} className="text-foreground" />
            </Link>
          </Button>
          <div className="space-y-0.5">
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-foreground">Reservation Details</h1>
            <div className="flex items-center gap-2 text-muted-foreground font-mono text-xs">
              <Hash size={14} className="text-muted-foreground/60" />
              <span className="font-bold tracking-widest">{booking?.id.toUpperCase()}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {canCancelAsCustomer && (
            <Button
              variant="outline"
              disabled={isPending}
              onClick={() => handleStatusUpdate("CANCELLED")}
              className="rounded-xl px-6 h-10 text-[10px] font-black uppercase tracking-widest border-destructive/20 text-destructive hover:bg-destructive/10 transition-all shadow-none"
            >
              Cancel Reservation
            </Button>
          )}

          {canOpenStatusModal && (
            <Dialog open={isStatusModalOpen} onOpenChange={setIsStatusModalOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="default"
                  disabled={isPending}
                  className="rounded-xl px-6 h-10 text-[10px] font-black uppercase tracking-widest bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20"
                >
                  Manage Status
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md rounded-[2rem] border-border bg-card shadow-2xl">
                <DialogHeader>
                  <DialogTitle className="text-xl font-black tracking-tight text-foreground">Update Status</DialogTitle>
                  <DialogDescription className="text-sm font-medium text-muted-foreground">
                    Change the current state of this reservation.
                  </DialogDescription>
                </DialogHeader>

                <div className="py-6 space-y-3">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Target State</label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value as BookingStatus)}
                    className="h-12 w-full rounded-2xl border border-border bg-background px-4 text-sm font-bold text-foreground focus:ring-2 focus:ring-primary/10 outline-none transition-all appearance-none cursor-pointer"
                    disabled={isPending}
                  >
                    {ownerAdminStatusOptions.map((status) => (
                      <option key={status} value={status} className="bg-card">{status}</option>
                    ))}
                  </select>
                </div>

                <DialogFooter className="gap-3 sm:justify-between">
                  <Button variant="ghost" className="rounded-xl font-bold uppercase text-[10px] tracking-widest" onClick={() => setIsStatusModalOpen(false)} disabled={isPending}>Cancel</Button>
                  <Button className="rounded-xl font-black uppercase text-[10px] tracking-widest px-8" onClick={() => handleStatusUpdate(selectedStatus)} disabled={isPending || selectedStatus === currentStatus}>
                    {isPending ? "Processing..." : "Confirm Update"}
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
          <div className="bg-card rounded-[2rem] border border-border shadow-sm overflow-hidden transition-all hover:shadow-md">
            <div className="p-6 md:p-8 space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
                <div className="space-y-3">
                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 px-3 py-1 font-black text-[9px] rounded-full uppercase tracking-widest">
                    Reserved Experience
                  </Badge>
                  <h2 className="text-2xl md:text-3xl font-black text-foreground leading-tight tracking-tight">
                    {booking?.event?.title || "Unknown Experience"}
                  </h2>
                </div>
                <div className="flex flex-col sm:items-end gap-2">
                  <Badge variant="outline" className={cn(
                      "rounded-full font-black px-4 py-1.5 text-[10px] tracking-[0.15em] uppercase border",
                      currentStatus === "CANCELLED" ? "bg-destructive/10 text-destructive border-destructive/20" : 
                      currentStatus === "CONFIRMED" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-muted text-muted-foreground border-border"
                  )}>
                      {currentStatus}
                  </Badge>
                  <span className="text-[9px] text-muted-foreground font-black uppercase tracking-widest px-1">Reservation Status</span>
                </div>
              </div>

              {/* Images */}
              {Array.isArray(booking?.event?.images) && booking?.event.images.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {booking?.event.images.slice(0, 2).map((image, index) => (
                    <div key={index} className="aspect-[16/9] rounded-2xl overflow-hidden border border-border group relative bg-muted">
                      <img src={image} alt="Event" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-all" />
                    </div>
                  ))}
                </div>
              )}

              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pt-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin size={14} className="text-primary" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Location</span>
                  </div>
                  <p className="font-bold text-foreground text-sm tracking-tight">{booking?.event?.location || "Cox's Bazar"}</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users size={14} className="text-primary" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Guests</span>
                  </div>
                  <p className="font-bold text-foreground text-sm tracking-tight">{booking?.seats} Seats Confirmed</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Ticket size={14} className="text-primary" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Investment</span>
                  </div>
                  <p className="font-bold text-foreground text-sm tracking-tight">৳{booking?.event?.per_person_price?.toLocaleString()}<span className="text-[10px] text-muted-foreground font-normal ml-1">/ seat</span></p>
                </div>
              </div>
            </div>
          </div>

          {/* Financials */}
          <div className="bg-card rounded-[2rem] border border-border p-6 md:p-8 shadow-sm">
            <div className="flex items-center justify-between mb-10">
              <h3 className="text-sm font-black text-foreground uppercase tracking-[0.2em] flex items-center gap-3">
                <CreditCard size={20} className="text-primary" />
                Payment Record
              </h3>
              <Badge variant="outline" className={cn(
                "rounded-full px-4 py-1 font-black text-[10px] uppercase tracking-widest border shadow-none",
                booking?.payment_status === "PAID" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-amber-500/10 text-amber-500 border-amber-500/20"
              )}>
                {booking?.payment_status}
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
              <div className="md:col-span-5 bg-muted/30 rounded-2xl p-8 border border-border flex flex-col justify-center transition-all hover:bg-muted/50">
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2">Total Amount Settled</p>
                <p className="text-4xl font-black text-foreground tracking-tighter">৳{booking?.total_amount.toLocaleString()}</p>
              </div>

              <div className="md:col-span-7 space-y-6">
                {booking?.payment ? (
                  <>
                    <div className="flex justify-between items-center text-sm border-b border-border pb-3">
                      <span className="text-muted-foreground font-bold uppercase tracking-widest text-[10px]">Reference ID</span>
                      <span className="font-mono text-foreground font-black tracking-tighter">{booking?.payment.transaction_id}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground font-bold uppercase tracking-widest text-[10px]">Settled On</span>
                      <span className="font-black text-foreground uppercase tracking-widest text-[10px]">{new Date(booking?.payment.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    </div>
                  </>
                ) : (
                  <div className="p-4 rounded-xl border border-dashed border-border bg-muted/20 text-center">
                    <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">No transaction history detected.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* --- RIGHT SIDEBAR (4 cols) --- */}
        <div className="lg:col-span-4 space-y-8">
          
          <div className="bg-card rounded-[2rem] border border-border p-6 md:p-8 shadow-sm">
            <h3 className="text-sm font-black text-foreground uppercase tracking-[0.2em] flex items-center gap-3 mb-8">
              <Clock size={20} className="text-primary" />
              Activity Log
            </h3>
            
            <div className="space-y-10 relative before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-[2px] before:bg-muted">
              <div className="relative pl-8">
                <div className="absolute left-0 top-1.5 w-4 h-4 rounded-full bg-primary border-4 border-card shadow-sm" />
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Reservation Initiated</p>
                <p className="text-[13px] font-bold text-foreground uppercase tracking-tight">{new Date(booking?.createdAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}</p>
              </div>
              <div className="relative pl-8">
                <div className="absolute left-0 top-1.5 w-4 h-4 rounded-full bg-muted border-4 border-card shadow-sm" />
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Last System Update</p>
                <p className="text-[13px] font-bold text-foreground uppercase tracking-tight">{new Date(booking?.updatedAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}</p>
              </div>
            </div>
          </div>

          <div className="bg-muted/30 rounded-[2rem] border border-border p-8 transition-all hover:bg-muted/50">
            <div className="flex gap-4">
              <AlertCircle className="text-primary shrink-0" size={20} />
              <div className="space-y-2">
                <h4 className="font-black text-[10px] text-foreground uppercase tracking-widest">Customer Support</h4>
                <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                  Need to modify your reservation? Our concierge team is available 24/7 to assist with your requirements.
                </p>
                <Button variant="link" className="p-0 h-auto text-[10px] text-primary font-black uppercase tracking-widest group">
                  Open Support Ticket <ChevronRight size={12} className="group-hover:translate-x-1 transition-transform" />
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