'use client';
import { getEvents } from "@/app/(withCommonLyout)/event/_actions";
import { useQuery } from "@tanstack/react-query";


const EventList = () => {

    const { data  } = useQuery({
       queryKey: ["events"],
       queryFn: () => getEvents(),
     });

     console.log(data);
  return <div>
    Event list 
  </div>;
};

export default EventList;