"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { EventStatus, IEvent, IEventsListData } from "@/types/event.types";


export const getOwnerEvents = async (queryString?: string) => {
  try {
    return await httpClient.get<IEventsListData>(
      queryString ? `/event/auth?${queryString}` : "/owner/events",
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

export const updateActiveStatus = async (id: string) => {
  try {
    return await httpClient.patch<IEvent>(`event/${id}/active-status`, undefined);
  } catch (error) {
    console.error("Error updating event active status:", error);
    throw error;
  }
};

export const updateEventStatus = async (id: string, status: EventStatus) => {
  try {
    return await httpClient.patch<IEvent>(`/event/${id}/status`, {
      status,
    });
  } catch (error) {
    console.log('Error updating event status:', error);
    throw error;
  }
};

export const createEvent = async (data: FormData) => {
  try {
    return await httpClient.post<IEvent>("/event", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  } catch (error: any) {
    const message = error?.response?.data?.message || "Failed to create event. Please try again.";
    console.error("Error creating event:", error);
    throw new Error(message);
  }
};

export const updateEvent = async (id: string, data: FormData) => {
  try {
    return await httpClient.patch<IEvent>(`/event/${id}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  } catch (error: any) {
    const message = error?.response?.data?.message || "Failed to update event. Please try again.";
    console.error("Error updating event:", error);
    throw new Error(message);
  }
};