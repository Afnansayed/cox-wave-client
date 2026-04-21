import { IOwner } from "./account.types";
import { IReview } from "./review.types";

export type EventStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface IEvent {
  id: string;
  title: string;
  description?: string | null;
  location?: string | null;

  images: string[];

  capacity: number;
  remaining_seats: number;
  per_person_price: number;

  status: EventStatus;
  isActive: boolean;
  isDeleted: boolean;
  deletedAt?: Date | null;

  createdAt: Date;
  updatedAt: Date;

  owner_id: string;

  owner : IOwner;
  reviews?: IReview[];
}


export interface ICreateEvent {
  title: string;
  description?: string;
  location?: string;
  images?: string[];

  capacity: number;
  per_person_price: number;

  owner_id: string;
}

export interface IUpdateEvent {
  title?: string;
  description?: string;
  location?: string;
  images?: string[];

  capacity?: number;
  per_person_price?: number;

  status?: EventStatus;
  isActive?: boolean;
}

export interface IEventsListData {
    meta?: {
    page: number;
    limit: number;
    total: number;
  };
  data: IEvent[];
}