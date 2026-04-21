"use client";

import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, CalendarDays, Hash, ImageOff, MapPin, Star, Ticket, Users, Wallet } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getOwnerEventById, updateActiveStatus, updateEventStatus } from "@/components/services/event.service";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { EventStatus } from "@/types/event.types";
import { useState } from "react";
import { UpdateEventStatusModal } from "./UpdateEventStatusModal";

type DashboardEventDetailsProps = {
  id: string;
  basePath?: string;
};

const statusClass = (status: string) => {
  switch (status) {
    case "APPROVED":
      return "bg-green-100 text-green-700";
    case "REJECTED":
      return "bg-red-100 text-red-700";
    default:
      return "bg-yellow-100 text-yellow-700";
  }
};

const DashboardEventDetails = ({ id, basePath = "/owner-dashboard/event" }: DashboardEventDetailsProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();

    // 1. State for Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<{id: string, status: EventStatus} | null>(null);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["owner-event", id],
    queryFn: () => getOwnerEventById(id),
  });

  const { mutateAsync, isPending } = useMutation({
    mutationFn: () => updateActiveStatus(id),
  });



  const event = data?.data;
  const isBusy = isLoading || isFetching;



    const handleActiveStatusUpdate = async () => {
    const toastId = toast.loading("Updating event active status...");

    try {
      const response = await mutateAsync();

      if (!response.success) {
        toast.error(response.message || "Failed to update event status.", {
          id: toastId,
        });
        return;
      }
      toast.success(response.message || "Event active status updated.", {
        id: toastId,
      });
      router.refresh();
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to update event active status.";
      toast.error(message, { id: toastId });
    }
  };





  // 2. Mutation Logic
  const { mutateAsync: eventStatusUpdate, isPending: inPendingTwo } = useMutation({
    mutationFn: (newStatus: EventStatus) => updateEventStatus(selectedEvent!.id, newStatus),
    onSuccess: (res) => {
      toast.success("Status updated successfully");
      queryClient.invalidateQueries({ queryKey: ["owner-event", selectedEvent!.id] });
      setIsModalOpen(false);
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to update status");
    }
  });

  // 3. Open Modal Handler
 const handleOpenModal = () => {
  if (event) {
    setSelectedEvent({ id: event.id, status: event.status });
    setIsModalOpen(true);
  }
};


  if (isBusy || !event) {
    return (
      <section className="space-y-6 p-4 md:p-8">
        <div className="h-10 w-48 animate-pulse rounded-xl bg-secondary/20" />
        <div className="h-[560px] animate-pulse rounded-2xl bg-secondary/10" />
      </section>
    );
  }
  

  return (
    <section className="space-y-6 p-4 md:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Event Details</h1>
          <p className="text-sm text-muted-foreground">Event ID: {event.id}</p>
        </div>
        <div >
         {basePath === "/owner-dashboard/event" && (
           <Button onClick={() => handleActiveStatusUpdate()}  variant="outline" className="mr-2 bg-primary text-white hover:text-white hover:bg-primary/90">
            {isPending? "Changing Active Status..." : "Change Active Status"}
           </Button>
         )}

      {basePath === "/admin-dashboard/event" && (
        <Button onClick={handleOpenModal} variant="outline" className="mr-2 bg-primary text-white hover:text-white hover:bg-primary/90">
          Change Status
        </Button>
      )}
        <Button asChild variant="outline">
          <Link href={basePath}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Events
          </Link>
        </Button>
 </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-xs text-muted-foreground">Title</p>
          <p className="font-semibold">{event.title}</p>
        </div>
        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-xs text-muted-foreground">Location</p>
          <p className="font-semibold">{event.location || "N/A"}</p>
        </div>
        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-xs text-muted-foreground">Status</p>
          <Badge className={statusClass(event.status)}>{event.status}</Badge>
        </div>
        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-xs text-muted-foreground">Active Status</p>
          <Badge className={statusClass(event.isActive ? "APPROVED" : "REJECTED")}>
            {event.isActive ? "Active" : "Inactive"}
          </Badge>
        </div>
        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-xs text-muted-foreground">Price</p>
          <p className="font-semibold">${event.per_person_price}</p>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-xs text-muted-foreground">Capacity</p>
          <p className="font-semibold flex items-center gap-1"><Users className="h-4 w-4" /> {event.capacity}</p>
        </div>
        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-xs text-muted-foreground">Remaining Seats</p>
          <p className="font-semibold flex items-center gap-1"><Ticket className="h-4 w-4" /> {event.remaining_seats}</p>
        </div>
        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-xs text-muted-foreground">Created At</p>
          <p className="font-semibold">{new Date(event.createdAt).toLocaleString()}</p>
        </div>
        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-xs text-muted-foreground">Updated At</p>
          <p className="font-semibold">{new Date(event.updatedAt).toLocaleString()}</p>
        </div>
      </div>

      <div className="rounded-2xl border bg-white p-5 shadow-sm">
        <p className="text-xs text-muted-foreground">Description</p>
        <p className="mt-2 text-sm leading-relaxed">{event.description || "N/A"}</p>
      </div>

      <div className="rounded-2xl border bg-white p-5 shadow-sm">
        <p className="mb-3 text-xs text-muted-foreground">Images</p>
        {event.images?.length ? (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
            {event.images.map((image, index) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={`${image}-${index}`}
                src={image}
                alt={`${event.title}-${index + 1}`}
                className="h-28 w-full rounded-lg border object-cover"
              />
            ))}
          </div>
        ) : (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <ImageOff className="h-4 w-4" /> No images available
          </div>
        )}
      </div>

      <div className="rounded-2xl border bg-white p-5 shadow-sm">
        <p className="mb-3 text-xs text-muted-foreground">Owner</p>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-xs text-muted-foreground">Name</p>
            <p className="font-semibold">{event.owner?.business_name || event.owner?.name || "N/A"}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Email</p>
            <p className="font-semibold">{event.owner?.email || "N/A"}</p>
          </div>
        </div>
      </div>

      {event.reviews?.length ? (
        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="mb-3 text-xs text-muted-foreground">Latest Reviews</p>
          <div className="space-y-3">
            {event.reviews.slice(0, 5).map((review) => (
              <div key={review.id} className="rounded-lg border p-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold">{review.customer?.name || "Guest"}</p>
                  <span className="inline-flex items-center gap-1 text-xs">
                    <Star className="h-3.5 w-3.5 text-amber-500" /> {review?.rating}
                  </span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{review?.comment}</p>
              </div>
            ))}
          </div>
        </div>
      ) : null}

{selectedEvent && (
  <UpdateEventStatusModal
    isOpen={isModalOpen}
    onClose={() => setIsModalOpen(false)}
    currentStatus={selectedEvent.status}
    // Wrap it in an arrow function to match the expected return type
    onSubmit={async (status) => {
      await eventStatusUpdate(status);
    }}
    isPending={inPendingTwo}
  />
)}
    </section>
  );
};

export default DashboardEventDetails;
