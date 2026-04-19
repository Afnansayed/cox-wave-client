'use server';
import { httpClient } from "@/lib/axios/httpClient";
import { PaginationMeta } from "@/types/api.types";
import { IEvent } from "@/types/event.types";


interface IGetEventsResponse {
    data: IEvent[];
    meta?: PaginationMeta;
}
export const getEvents = async (queryString: string) => {
    try {
        const response = await httpClient.get<IGetEventsResponse>(
            queryString
                ? `/event?${queryString}`
                : "/event",
        );
        console.log({response})
        return response;
    } catch (error) {
        console.log("Error fetching events:", error);
        throw error;
    }
}

export const getEventsById = async (id: string) => {
    const event = await httpClient.get<IEvent>(`/event/${id}`);
    console.log(event, "server");
    return event;
}