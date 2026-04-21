"use client";

import { useState } from "react";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { 
  ArrowLeft, 
  Users, 
  Ticket, 
  Star, 
  ImageOff, 
  MapPin, 
  Calendar, 
  Hash, 
  Mail, 
  Building2, 
  Clock, 
  ChevronRight,
  ShieldCheck,
  Power
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getOwnerEventById, updateActiveStatus, updateEventStatus } from "@/components/services/event.service";
import { EventStatus } from "@/types/event.types";
import { UpdateEventStatusModal } from "./UpdateEventStatusModal";
import { cn } from "@/lib/utils";

type DashboardEventDetailsProps = {
  id: string;
  basePath?: string;
};

const DashboardEventDetails = ({ id, basePath = "/owner-dashboard/event" }: DashboardEventDetailsProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<{id: string, status: EventStatus} | null>(null);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["owner-event", id],
    queryFn: () => getOwnerEventById(id),
  });

  const { mutateAsync: activeStatusUpdate, isPending: isUpdatingActive } = useMutation({
    mutationFn: () => updateActiveStatus(id),
  });

  const { mutateAsync: eventStatusUpdate, isPending: isUpdatingStatus } = useMutation({
    mutationFn: (newStatus: EventStatus) => updateEventStatus(selectedEvent!.id, newStatus),
    onSuccess: () => {
      toast.success("Event status updated successfully");
      queryClient.invalidateQueries({ queryKey: ["owner-event", id] });
      setIsModalOpen(false);
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to update status");
    }
  });

  const event = data?.data;
  const isBusy = isLoading || isFetching;

  const handleActiveStatusUpdate = async () => {
    const toastId = toast.loading("Updating visibility...");
    try {
      const response = await activeStatusUpdate();
      if (!response.success) throw new Error(response.message);
      toast.success("Event active status updated", { id: toastId });
      queryClient.invalidateQueries({ queryKey: ["owner-event", id] });
    } catch (error: any) {
      toast.error(error.message || "Update failed", { id: toastId });
    }
  };

  const handleOpenModal = () => {
    if (event) {
      setSelectedEvent({ id: event.id, status: event.status });
      setIsModalOpen(true);
    }
  };

  if (isBusy || !event) {
    return (
      <div className="w-full max-w-7xl mx-auto space-y-8 p-4 md:p-6 animate-pulse">
        <div className="h-20 bg-slate-100 rounded-3xl w-full" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 h-[600px] bg-slate-50 rounded-3xl" />
          <div className="h-[400px] bg-slate-50 rounded-3xl" />
        </div>
      </div>
    );
  }

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "APPROVED": return "bg-emerald-50 text-emerald-600 border-emerald-100";
      case "REJECTED": return "bg-rose-50 text-rose-600 border-rose-100";
      default: return "bg-amber-50 text-amber-600 border-amber-100";
    }
  };

  return (
    <div className="w-full  mx-auto space-y-8 pb-12 p-4 md:p-6">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="flex items-center gap-4">
          <Button asChild variant="outline" size="icon" className="rounded-xl border-slate-200 h-10 w-10 shrink-0">
            <Link href={basePath}>
              <ArrowLeft size={18} className="text-slate-600" />
            </Link>
          </Button>
          <div className="space-y-0.5">
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-slate-900">{event.title}</h1>
            <div className="flex items-center gap-2 text-slate-500 font-mono text-xs">
              <Hash size={14} className="text-slate-400" />
              <span>{event.id.toUpperCase()}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {basePath === "/owner-dashboard/event" && (
            <Button 
              onClick={handleActiveStatusUpdate} 
              disabled={isUpdatingActive}
              className={cn(
                "rounded-xl px-5 h-10 text-xs font-semibold transition-all",
                event.isActive ? "bg-rose-50 text-rose-600 hover:bg-rose-100" : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
              )}
            >
              <Power size={14} className="mr-2" />
              {isUpdatingActive ? "Processing..." : event.isActive ? "Deactivate Event" : "Activate Event"}
            </Button>
          )}

          {basePath === "/admin-dashboard/event" && (
            <Button onClick={handleOpenModal} className="rounded-xl px-5 h-10 text-xs font-semibold bg-primary hover:bg-primary/90 text-white transition-all">
              <ShieldCheck size={14} className="mr-2" />
              Change Approval Status
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* --- LEFT COLUMN: DETAILS & CONTENT --- */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Main Info Card */}
          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-6 md:p-8 space-y-8">
              
              {/* Image Gallery Header */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">Event Media</h3>
                  <Badge variant="outline" className="rounded-md px-2 text-[10px] font-mono border-slate-100">
                    {event.images?.length || 0} Files
                  </Badge>
                </div>
                
                {event.images?.length ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {event.images.map((image, index) => (
                      <div key={index} className="aspect-video rounded-2xl overflow-hidden border border-slate-50 group relative">
                        <img src={image} alt="" className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="h-32 flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 text-slate-400">
                    <ImageOff size={24} className="mb-2 opacity-50" />
                    <span className="text-xs">No event images uploaded</span>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">Description</h3>
                <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap">
                  {event.description || "No description provided for this event."}
                </p>
              </div>

              {/* Reviews Section */}
              {event?.reviews && event.reviews?.length > 0 ?(
                <div className="pt-6 border-t border-slate-50 space-y-6">
                  <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">Recent Reviews</h3>
                  <div className="grid gap-4">
                    {event.reviews.slice(0, 3).map((review) => (
                      <div key={review.id} className="p-4 rounded-2xl bg-slate-50/50 border border-slate-100">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-semibold text-slate-900">{review.customer?.name || "Verified Customer"}</span>
                          <div className="flex items-center gap-1 text-amber-500 bg-amber-50 px-2 py-0.5 rounded-lg text-xs font-bold">
                            <Star size={12} fill="currentColor" /> {review.rating}
                          </div>
                        </div>
                        <p className="text-xs text-slate-500 leading-normal">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ):
               <div className="pt-6 border-t border-slate-50 space-y-6">
                  <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">Recent Reviews</h3>
                  <div className="flex items-center gap-2 text-slate-400 text-xs">
                    <Star size={14} />
                    <span>No reviews for this event yet</span>
                  </div>
                </div>
              }
            </div>
          </div>
        </div>

        {/* --- RIGHT COLUMN: STATUS & STATS --- */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Status & Pricing Card */}
          <div className="bg-white rounded-[2rem] border border-slate-100 p-6 md:p-8 shadow-sm space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Listing Status</span>
                <Badge className={cn("rounded-lg px-3 py-1 text-[10px] font-bold uppercase", getStatusStyle(event.status))}>
                  {event.status}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Visibility</span>
                <Badge className={cn(
                  "rounded-lg px-3 py-1 text-[10px] font-bold uppercase",
                  event.isActive ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-500"
                )}>
                  {event.isActive ? "Publicly Active" : "Private / Inactive"}
                </Badge>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-50">
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">Pricing</p>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-slate-900">৳{event.per_person_price}</span>
                <span className="text-slate-400 text-xs">/ per seat</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                <Users size={16} className="text-slate-400 mb-2" />
                <p className="text-[10px] font-bold text-slate-400 uppercase">Capacity</p>
                <p className="text-sm font-semibold text-slate-900">{event.capacity}</p>
              </div>
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                <Ticket size={16} className="text-slate-400 mb-2" />
                <p className="text-[10px] font-bold text-slate-400 uppercase">Remaining</p>
                <p className="text-sm font-semibold text-slate-900">{event.remaining_seats}</p>
              </div>
            </div>

            <div className="space-y-3 pt-2">
               <div className="flex items-center gap-3 text-sm text-slate-600">
                <MapPin size={16} className="text-slate-400 shrink-0" />
                <span>{event.location || "Location not specified"}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <Clock size={16} className="text-slate-400 shrink-0" />
                <span>Created {new Date(event.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* Owner Info Card */}
          <div className="bg-slate-50 rounded-[2rem] border border-slate-100 p-6 md:p-8 space-y-6">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Event Provider</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-primary">
                  <Building2 size={20} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{event.owner?.business_name || event.owner?.name}</p>
                  <p className="text-[11px] text-slate-500">Professional Host</p>
                </div>
              </div>
              <div className="space-y-3 pt-2 border-t border-slate-200/60">
                <div className="flex items-center gap-3 text-xs text-slate-600">
                  <Mail size={14} className="text-slate-400 shrink-0" />
                  <span className="truncate">{event.owner?.email}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- MODAL --- */}
      {selectedEvent && (
        <UpdateEventStatusModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          currentStatus={selectedEvent.status}
          onSubmit={async (status) => {
            await eventStatusUpdate(status);
          }}
          isPending={isUpdatingStatus}
        />
      )}
    </div>
  );
};

export default DashboardEventDetails;