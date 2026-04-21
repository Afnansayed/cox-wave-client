"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createEvent } from "@/components/services/event.service";
import {
  createEventValidationSchema,
  type CreateEventFormData,
} from "@/zod/event.validation";

const getFirstError = (errorMessage: string | undefined) => errorMessage || "";

export function OwnerEventCreate() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const form = useForm({
    defaultValues: {
      title: "",
      description: "",
      location: "",
      capacity: undefined as number | undefined,
      per_person_price: undefined as number | undefined,
    },
    onSubmit: async ({ value }) => {
      const parsed = createEventValidationSchema.safeParse(value);

      if (!parsed.success) {
        toast.error(parsed.error.issues[0]?.message || "Please fix the form errors.");
        return;
      }

      try {
        setIsLoading(true);

        const formData = new FormData();
        formData.append("title", parsed.data.title);

        if (parsed.data.description?.trim()) {
          formData.append("description", parsed.data.description.trim());
        }

        if (parsed.data.location?.trim()) {
          formData.append("location", parsed.data.location.trim());
        }

        formData.append("capacity", String(parsed.data.capacity));
        formData.append("per_person_price", String(parsed.data.per_person_price));

        selectedFiles.forEach((file) => {
          formData.append("images", file);
        });

        const response = await createEvent(formData);

        if (response.data) {
          toast.success("Event created successfully!");
          router.push("/owner-dashboard/event");
          router.refresh();
        }
      } catch (error) {
        console.error("Error creating event:", error);
        toast.error(error instanceof Error ? error.message : "Failed to create event");
      } finally {
        setIsLoading(false);
      }
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles((prev) => [...prev, ...Array.from(e.target.files || [])]);
      e.target.value = "";
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Create New Event</h1>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
        className="space-y-6"
      >
        <form.Field
          name="title"
          validators={{
            onChange: ({ value }) => {
              const result = createEventValidationSchema.shape.title.safeParse(value);
              return result.success ? undefined : result.error.issues[0]?.message;
            },
          }}
        >
          {(field) => (
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="Enter event title"
                disabled={isLoading}
              />
              {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                <p className="text-sm text-red-600">{getFirstError(field.state.meta.errors[0])}</p>
              )}
            </div>
          )}
        </form.Field>

        <form.Field
          name="description"
          validators={{
            onChange: ({ value }) => {
              const result = createEventValidationSchema.shape.description.safeParse(value);
              return result.success ? undefined : result.error.issues[0]?.message;
            },
          }}
        >
          {(field) => (
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="Enter event description"
                disabled={isLoading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
              />
              {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                <p className="text-sm text-red-600">{getFirstError(field.state.meta.errors[0])}</p>
              )}
            </div>
          )}
        </form.Field>

        <form.Field
          name="location"
          validators={{
            onChange: ({ value }) => {
              const result = createEventValidationSchema.shape.location.safeParse(value);
              return result.success ? undefined : result.error.issues[0]?.message;
            },
          }}
        >
          {(field) => (
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="Enter event location"
                disabled={isLoading}
              />
              {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                <p className="text-sm text-red-600">{getFirstError(field.state.meta.errors[0])}</p>
              )}
            </div>
          )}
        </form.Field>

        <form.Field
          name="capacity"
          validators={{
            onChange: ({ value }) => {
              const result = createEventValidationSchema.shape.capacity.safeParse(value);
              return result.success ? undefined : result.error.issues[0]?.message;
            },
          }}
        >
          {(field) => (
            <div className="space-y-2">
              <Label htmlFor="capacity">Capacity *</Label>
              <Input
                id="capacity"
                name={field.name}
                type="number"
                value={field.state.value ?? ""}
                onBlur={field.handleBlur}
                onChange={(e) =>
                  field.handleChange(
                    e.target.value === ""
                      ? undefined
                      : Number(e.target.value)
                  )
                }
                placeholder="Enter event capacity"
                disabled={isLoading}
                min="1"
              />
              {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                <p className="text-sm text-red-600">{getFirstError(field.state.meta.errors[0])}</p>
              )}
            </div>
          )}
        </form.Field>

        <form.Field
          name="per_person_price"
          validators={{
            onChange: ({ value }) => {
              const result = createEventValidationSchema.shape.per_person_price.safeParse(value);
              return result.success ? undefined : result.error.issues[0]?.message;
            },
          }}
        >
          {(field) => (
            <div className="space-y-2">
              <Label htmlFor="per_person_price">Price Per Person *</Label>
              <Input
                id="per_person_price"
                name={field.name}
                type="number"
                value={field.state.value ?? ""}
                onBlur={field.handleBlur}
                onChange={(e) =>
                  field.handleChange(
                    e.target.value === ""
                      ? undefined
                      : Number(e.target.value)
                  )
                }
                placeholder="Enter price per person"
                disabled={isLoading}
                min="0"
                step="0.01"
              />
              {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                <p className="text-sm text-red-600">{getFirstError(field.state.meta.errors[0])}</p>
              )}
            </div>
          )}
        </form.Field>

        <div className="space-y-2">
          <Label htmlFor="images">Event Images</Label>
          <Input
            id="images"
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            disabled={isLoading}
          />
          {selectedFiles.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                {selectedFiles.length} file(s) selected
              </p>
              <div className="flex flex-wrap gap-2">
                {selectedFiles.map((file, index) => (
                  <span
                    key={`${file.name}-${index}`}
                    className="rounded-md bg-muted px-2 py-1 text-xs"
                  >
                    {file.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-4">
          <Button
            type="submit"
            disabled={isLoading || !form.state.canSubmit}
            className="flex-1"
          >
            {isLoading ? "Creating..." : "Create Event"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isLoading}
            className="flex-1"
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
