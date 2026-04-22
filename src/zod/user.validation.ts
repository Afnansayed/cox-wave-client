import z from "zod";

export const updateProfileSchema = z.object({
  name: z
    .string()
    .min(5, { message: "Name must be at least 5 characters long" })
    .max(30, { message: "Name cannot exceed 30 characters" })
    .optional(),

  phone_number: z
    .string()
    .regex(/^(?:\+88|88)?(01[3-9]\d{8})$/, {
      message: "Please provide a valid Bangladesh phone number",
    })
    .optional(),

  address: z
    .string()
    .min(10, { message: "Please provide a more detailed personal address" })
    .max(255, { message: "Address cannot exceed 255 characters" })
    .optional(),
});

