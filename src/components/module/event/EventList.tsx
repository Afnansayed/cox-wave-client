'use client';

import { useQuery } from "@tanstack/react-query";
import { getEvents } from "@/app/(withCommonLayout)/event/_actions";
import EventCard from "./EventCard";

const EventList = () => {
  const { data: events} = useQuery({
    queryKey: ["events"],
    queryFn: () => getEvents(),
  });

  return (
    <div className="bg-neutral-50 py-12">

      <div className="container-max px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events?.data?.data.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default EventList;