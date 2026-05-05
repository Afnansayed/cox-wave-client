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
        <div className="h-20 bg-muted rounded-3xl w-full" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 h-[600px] bg-muted/40 rounded-3xl" />
          <div className="h-[400px] bg-muted/40 rounded-3xl" />
        </div>
      </div>
    );
  }

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "APPROVED": return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
      case "REJECTED": return "bg-destructive/10 text-destructive border-destructive/20";
      default: return "bg-amber-500/10 text-amber-500 border-amber-500/20";
    }
  };

  return (
    <div className="w-full  mx-auto space-y-8 pb-12 p-4 md:p-6">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="flex items-center gap-4">
          <Button asChild variant="outline" size="icon" className="rounded-xl border-border h-10 w-10 shrink-0 bg-background">
            <Link href={basePath}>
              <ArrowLeft size={18} className="text-foreground" />
            </Link>
          </Button>
          <div className="space-y-0.5">
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-foreground">{event.title}</h1>
            <div className="flex items-center gap-2 text-muted-foreground font-mono text-xs">
              <Hash size={14} className="text-muted-foreground/60" />
              <span className="font-bold tracking-widest">{event.id.toUpperCase()}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {basePath === "/owner-dashboard/event" && (
            <Button 
              onClick={handleActiveStatusUpdate} 
              disabled={isUpdatingActive}
              variant="outline"
              className={cn(
                "rounded-xl px-5 h-10 text-[10px] font-black uppercase tracking-widest transition-all shadow-none",
                event.isActive 
                  ? "bg-destructive/5 text-destructive border-destructive/20 hover:bg-destructive/10" 
                  : "bg-emerald-500/5 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/10"
              )}
            >
              <Power size={14} className="mr-2" />
              {isUpdatingActive ? "Processing..." : event.isActive ? "Deactivate" : "Activate"}
            </Button>
          )}

          {basePath === "/admin-dashboard/event" && (
            <Button onClick={handleOpenModal} className="rounded-xl px-5 h-10 text-[10px] font-black uppercase tracking-widest bg-primary hover:bg-primary/90 text-primary-foreground transition-all shadow-lg shadow-primary/20">
              <ShieldCheck size={14} className="mr-2" />
              Approval Status
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* --- LEFT COLUMN: DETAILS & CONTENT --- */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Main Info Card */}
          <div className="bg-card rounded-[2rem] border border-border shadow-sm overflow-hidden">
            <div className="p-6 md:p-8 space-y-8">
              
              {/* Image Gallery Header */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-[10px] font-black text-foreground uppercase tracking-[0.2em]">Event Media</h3>
                  <Badge variant="outline" className="rounded-full px-3 py-1 text-[10px] font-mono border-border bg-muted/30">
                    {event.images?.length || 0} Files
                  </Badge>
                </div>
                
                {event.images?.length ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {event.images.map((image, index) => (
                      <div key={index} className="aspect-video rounded-2xl overflow-hidden border border-border group relative bg-muted">
                        <img src={image} alt="" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-all" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="h-40 flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-border bg-muted/30 text-muted-foreground transition-colors hover:bg-muted/50">
                    <ImageOff size={32} className="mb-3 opacity-30" />
                    <span className="text-xs font-bold uppercase tracking-widest">No Media Found</span>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <h3 className="text-[10px] font-black text-foreground uppercase tracking-[0.2em]">Description</h3>
                <p className="text-muted-foreground text-sm leading-relaxed whitespace-pre-wrap font-medium">
                  {event.description || "No description provided for this event."}
                </p>
              </div>

              {/* Reviews Section */}
              {event?.reviews && event.reviews?.length > 0 ?(
                <div className="pt-8 border-t border-border space-y-6">
                  <h3 className="text-[10px] font-black text-foreground uppercase tracking-[0.2em]">Recent Guest Feedback</h3>
                  <div className="grid gap-4">
                    {event.reviews.slice(0, 3).map((review) => (
                      <div key={review.id} className="p-5 rounded-2xl bg-muted/30 border border-border hover:bg-muted/50 transition-colors">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm font-bold text-foreground">{review.customer?.name || "Verified Customer"}</span>
                          <div className="flex items-center gap-1.5 text-amber-500 bg-amber-500/10 px-2.5 py-1 rounded-full text-xs font-black border border-amber-500/20">
                            <Star size={12} fill="currentColor" /> {review.rating}
                          </div>
                        </div>
                        <p className="text-[13px] text-muted-foreground leading-relaxed font-medium">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ):
               <div className="pt-8 border-t border-border space-y-6">
                  <h3 className="text-[10px] font-black text-foreground uppercase tracking-[0.2em]">Recent Reviews</h3>
                  <div className="flex items-center gap-3 text-muted-foreground text-xs font-bold uppercase tracking-widest bg-muted/20 p-6 rounded-2xl border border-dashed border-border">
                    <Star size={16} className="opacity-40" />
                    <span>Awaiting first review...</span>
                  </div>
                </div>
              }
            </div>
          </div>
        </div>

        {/* --- RIGHT COLUMN: STATUS & STATS --- */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Status & Pricing Card */}
          <div className="bg-card rounded-[2rem] border border-border p-6 md:p-8 shadow-sm space-y-8">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Listing Status</span>
                <Badge variant="outline" className={cn("rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest border", getStatusStyle(event.status))}>
                  {event.status}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Visibility</span>
                <Badge variant="outline" className={cn(
                  "rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest border",
                  event.isActive ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-muted text-muted-foreground border-border"
                )}>
                  {event.isActive ? "Public" : "Private"}
                </Badge>
              </div>
            </div>

            <div className="pt-6 border-t border-border">
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-3">Investment Details</p>
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-black text-foreground tracking-tighter">৳{event.per_person_price}</span>
                <span className="text-muted-foreground text-[10px] font-black uppercase tracking-widest">/ seat</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-muted/30 rounded-2xl p-5 border border-border group hover:bg-muted/50 transition-colors">
                <Users size={16} className="text-primary mb-3" />
                <p className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.15em]">Capacity</p>
                <p className="text-lg font-black text-foreground tracking-tight">{event.capacity}</p>
              </div>
              <div className="bg-muted/30 rounded-2xl p-5 border border-border group hover:bg-muted/50 transition-colors">
                <Ticket size={16} className="text-secondary mb-3" />
                <p className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.15em]">Available</p>
                <p className="text-lg font-black text-foreground tracking-tight">{event.remaining_seats}</p>
              </div>
            </div>

            <div className="space-y-4 pt-2">
               <div className="flex items-start gap-3 text-sm">
                <MapPin size={16} className="text-muted-foreground shrink-0 mt-0.5" />
                <span className="font-bold text-foreground leading-tight">{event.location || "Location not specified"}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Calendar size={16} className="text-muted-foreground shrink-0" />
                <span className="font-bold text-muted-foreground uppercase tracking-widest text-[10px]">Created {new Date(event.createdAt).toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' })}</span>
              </div>
            </div>
          </div>

          {/* Owner Info Card */}
          <div className="bg-muted/30 rounded-[2rem] border border-border p-6 md:p-8 space-y-6">
            <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Experience Provider</h3>
            <div className="space-y-5">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-card border border-border flex items-center justify-center text-primary shadow-sm">
                  <Building2 size={24} />
                </div>
                <div>
                  <p className="text-sm font-black text-foreground leading-none">{event.owner?.business_name || event.owner?.name}</p>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1.5 flex items-center gap-1">
                    <ShieldCheck size={10} className="text-emerald-500" />
                    Verified Provider
                  </p>
                </div>
              </div>
              <div className="space-y-3 pt-4 border-t border-border">
                <div className="flex items-center gap-3 text-xs text-muted-foreground hover:text-foreground transition-colors">
                  <Mail size={14} className="text-muted-foreground shrink-0" />
                  <span className="truncate font-bold tracking-tight">{event.owner?.email}</span>
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