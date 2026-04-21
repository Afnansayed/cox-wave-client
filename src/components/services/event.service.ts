"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { IEvent, IEventsListData } from "@/types/event.types";


export const getOwnerEvents = async (queryString?: string) => {
  try {
    return await httpClient.get<IEventsListData>(
      queryString ? `/event?${queryString}` : "/owner/events",
    );
  } catch (error) {
    console.error("Error fetching owner events:", error);
    throw error;
  }
};

export const getOwnerEventById = async (id: string) => {
  try {
    return await httpClient.get<IEvent>(`/event/${id}`);
  } catch (error) {
    console.error("Error fetching event details:", error);
    throw error;
  }
};
