import { z } from "zod";

export const createOwnerSchema = z.object({
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" })
    .max(100, { message: "Password is too long" }),

  owner: z.object({
    name: z
      .string()
      .min(5, { message: "Name must be at least 5 characters" })
      .max(30, { message: "Name is too long" }),

    email: z.string().email({ message: "Invalid email format" }),

    profile_picture: z
      .string()
      .url({ message: "Profile picture must be a valid URL" })
      .optional(),

    phone_number: z
      .string()
      .regex(/^(?:\+8801|01)[3-9]\d{8}$/, {
        message: "Invalid Bangladeshi phone number",
      })
      .optional(),

    address: z
      .string()
      .max(255, { message: "Address is too long" })
      .optional(),

    business_name: z
      .string()
      .min(2, { message: "Business name is required" })
      .max(150, { message: "Business name is too long" }),

    description: z
      .string()
      .max(500, { message: "Description is too long" })
      .optional(),

    business_address: z
      .string()
      .max(255, { message: "Business address is too long" })
      .optional(),

    bank_account: z.string().min(6, { message: "Bank account must be valid" }),
  }),
});

// ── Update Owner Profile ──────────────────────────────────────────────────────
// Mirrors the server-side updateOwnerValidationSchema exactly.
// All fields are optional — only send what the user changed.

export const updateOwnerProfileSchema = z.object({
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
    .optional(),

  business_name: z
    .string()
    .min(3, { message: "Business name must be at least 3 characters" })
    .optional(),

  description: z
    .string()
    .max(500, { message: "Description cannot exceed 500 characters" })
    .optional(),

  business_address: z
    .string()
    .min(10, { message: "Please provide a complete business location" })
    .optional(),

  bank_account: z
    .string()
    .min(8, { message: "Invalid bank account number length" })
    .regex(/^\d+$/, { message: "Bank account should only contain numbers" })
    .optional(),
});

export type UpdateOwnerProfileFormValues = z.infer<typeof updateOwnerProfileSchema>;
