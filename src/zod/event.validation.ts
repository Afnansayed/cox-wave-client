import { z } from "zod";
import { EventStatus } from "@/types/event.types";

export const eventStatusSchema = z.enum(["PENDING", "APPROVED", "REJECTED"]);

const optionalTrimmedString = (minLength: number, message: string) =>
  z.preprocess(
    (value) => (typeof value === "string" && value.trim().length === 0 ? undefined : value),
    z
      .string()
      .min(minLength, { message })
      .optional()
  );

export interface ICreateEvent {
  title: string;
  description?: string;
  location?: string;
  capacity: number;
  per_person_price: number;
}

export const createEventValidationSchema = z.object({
  title: z
    .string()
    .min(5, { message: "Title must be at least 5 characters long" })
    .max(100, { message: "Title must not exceed 100 characters" }),
  description: z.string().optional(),
  location: z
    .string()
    .min(5, { message: "Location is required with proper detail" })
    .optional(),
  capacity: z
    .number()
    .int()
    .positive({ message: "Capacity must be a positive integer" }),
  per_person_price: z
    .number()
    .nonnegative({ message: "Price cannot be negative" }),
});

export type CreateEventFormData = z.infer<typeof createEventValidationSchema>;

export interface IUpdateEvent {
  title?: string;
  description?: string;
  location?: string;
  capacity?: number;
  per_person_price?: number;
  status?: EventStatus;
  isActive?: boolean;
  imagesToDelete?: string[];
}

export const updateEventValidationSchema = z.object({
  title: optionalTrimmedString(
    5,
    "Title must be at least 5 characters long"
  ).refine((value) => value === undefined || value.length <= 100, {
    message: "Title must not exceed 100 characters",
  }),
  description: z.string().optional(),
  location: optionalTrimmedString(
    5,
    "Location is required with proper detail"
  ),
  capacity: z
    .number()
    .int()
    .positive({ message: "Capacity must be a positive integer" })
    .optional(),
  per_person_price: z
    .number()
    .nonnegative({ message: "Price cannot be negative" })
    .optional(),
  status: eventStatusSchema.optional(),
  isActive: z.boolean().optional(),
  imagesToDelete: z.array(z.string()).optional(),
});

export type UpdateEventFormData = z.infer<typeof updateEventValidationSchema>;
