'use server';
import { httpClient } from "@/lib/axios/httpClient";


interface EventInterface {
    id: string,
    name: string,
    description: string,
    date: string,
    location: string,
    createdAt: string,
    updatedAt: string,
}

export const getEvents = async () => {
    const events = await httpClient.get<EventInterface[]>('/event');
    console.log(events, "server");
    return events;
}