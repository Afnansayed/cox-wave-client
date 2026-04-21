"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

import { getOwnerEventById } from "@/components/services/event.service";
import { OwnerEventUpdate } from "@/components/module/event/OwnerEventUpdate";

export default function EditEventPage() {
  const params = useParams();
  const eventId = params.id as string;

  const { data: event, isLoading, error } = useQuery({
    queryKey: ["owner-event", eventId],
    queryFn: () => getOwnerEventById(eventId),
  });

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <Skeleton className="h-10 w-48 mb-6" />
        <div className="space-y-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error || !event?.data) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <p className="text-red-600 text-center">
          Failed to load event details. Please try again.
        </p>
      </div>
    );
  }

  return <OwnerEventUpdate event={event.data} />;
}
