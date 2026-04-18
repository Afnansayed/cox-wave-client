'use server';
import { httpClient } from "@/lib/axios/httpClient";
import { IEvent } from "@/types/event.types";


interface IEventResponse {
    data: IEvent[];
}

export const getEvents = async () => {
    const events = await httpClient.get<IEventResponse>('/event');
    console.log(events, "server");
    return events;
}