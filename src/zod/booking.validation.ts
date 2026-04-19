import { z } from 'zod';

export const createBookingZodSchema = z.object({
  event_id: z.uuid('Event id must be a valid UUID'),
  seats: z
    .number('Seats must be a number')
    .int('Seats must be a whole number')
    .min(1, 'At least 1 seat is required'),
});

export type ICreateBookingPayload = z.infer<typeof createBookingZodSchema>;
