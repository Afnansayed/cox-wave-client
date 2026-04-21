"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateEvent } from "@/components/services/event.service";
import {
  updateEventValidationSchema,
  type UpdateEventFormData,
} from "@/zod/event.validation";
import { IEvent } from "@/types/event.types";

const getFieldMessage = (message: string | undefined) => message || "";

type OwnerEventUpdateProps = {
  event: IEvent;
};

export function OwnerEventUpdate({ event }: OwnerEventUpdateProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);

  const form = useForm({
    defaultValues: {
      title: event.title ?? "",
      description: event.description ?? "",
      location: event.location ?? "",
      capacity: event.capacity,
      per_person_price: event.per_person_price,
      isActive: event.isActive,
    },
    onSubmit: async ({ value }) => {
      const parsed = updateEventValidationSchema.safeParse(value);

      if (!parsed.success) {
        toast.error(parsed.error.issues[0]?.message || "Please fix the form errors.");
        return;
      }

      try {
        setIsLoading(true);

        const formData = new FormData();

        if (parsed.data.title?.trim()) {
          formData.append("title", parsed.data.title.trim());
        }

        if (parsed.data.description?.trim()) {
          formData.append("description", parsed.data.description.trim());
        }

        if (parsed.data.location?.trim()) {
          formData.append("location", parsed.data.location.trim());
        }

        if (parsed.data.capacity !== undefined) {
          formData.append("capacity", String(parsed.data.capacity));
        }

        if (parsed.data.per_person_price !== undefined) {
          formData.append("per_person_price", String(parsed.data.per_person_price));
        }

        if (parsed.data.isActive !== undefined) {
          formData.append("isActive", String(parsed.data.isActive));
        }

        // Some multipart parsers return a plain string when a field appears once.
        // Append twice for a single item so backend consistently receives an array.
        if (imagesToDelete.length === 1) {
          formData.append("imagesToDelete", imagesToDelete[0]);
          formData.append("imagesToDelete", imagesToDelete[0]);
        } else {
          imagesToDelete.forEach((imageUrl) => {
            formData.append("imagesToDelete", imageUrl);
          });
        }

        selectedFiles.forEach((file) => {
          formData.append("images", file);
        });

        const response = await updateEvent(event.id, formData);

        if (response.data) {
          toast.success("Event updated successfully!");
          router.push("/owner-dashboard/event");
          router.refresh();
        }
      } catch (error) {
        console.error("Error updating event:", error);
        toast.error(error instanceof Error ? error.message : "Failed to update event");
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

  const toggleImageDelete = (imageUrl: string) => {
    setImagesToDelete((prev) =>
      prev.includes(imageUrl)
        ? prev.filter((url) => url !== imageUrl)
        : [...prev, imageUrl]
    );
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Update Event</h1>

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
              const result = updateEventValidationSchema.shape.title.safeParse(value);
              return result.success ? undefined : result.error.issues[0]?.message;
            },
          }}
        >
          {(field) => (
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
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
                <p className="text-sm text-red-600">{getFieldMessage(field.state.meta.errors[0])}</p>
              )}
            </div>
          )}
        </form.Field>

        <form.Field
          name="description"
          validators={{
            onChange: ({ value }) => {
              const result = updateEventValidationSchema.shape.description.safeParse(value);
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
                <p className="text-sm text-red-600">{getFieldMessage(field.state.meta.errors[0])}</p>
              )}
            </div>
          )}
        </form.Field>

        <form.Field
          name="location"
          validators={{
            onChange: ({ value }) => {
              const result = updateEventValidationSchema.shape.location.safeParse(value);
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
                <p className="text-sm text-red-600">{getFieldMessage(field.state.meta.errors[0])}</p>
              )}
            </div>
          )}
        </form.Field>

        <form.Field
          name="capacity"
          validators={{
            onChange: ({ value }) => {
              const result = updateEventValidationSchema.shape.capacity.safeParse(value);
              return result.success ? undefined : result.error.issues[0]?.message;
            },
          }}
        >
          {(field) => (
            <div className="space-y-2">
              <Label htmlFor="capacity">Capacity</Label>
              <Input
                id="capacity"
                name={field.name}
                type="number"
                value={field.state.value ?? ""}
                onBlur={field.handleBlur}
                onChange={(e) =>
                  field.handleChange(
                    (e.target.value ? Number(e.target.value) : undefined) as any
                  )
                }
                placeholder="Enter event capacity"
                disabled={isLoading}
                min="1"
              />
              {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                <p className="text-sm text-red-600">{getFieldMessage(field.state.meta.errors[0])}</p>
              )}
            </div>
          )}
        </form.Field>

        <form.Field
          name="per_person_price"
          validators={{
            onChange: ({ value }) => {
              const result = updateEventValidationSchema.shape.per_person_price.safeParse(value);
              return result.success ? undefined : result.error.issues[0]?.message;
            },
          }}
        >
          {(field) => (
            <div className="space-y-2">
              <Label htmlFor="per_person_price">Price Per Person</Label>
              <Input
                id="per_person_price"
                name={field.name}
                type="number"
                value={field.state.value ?? ""}
                onBlur={field.handleBlur}
                onChange={(e) =>
                  field.handleChange(
                    (e.target.value ? Number(e.target.value) : undefined) as any
                  )
                }
                placeholder="Enter price per person"
                disabled={isLoading}
                min="0"
                step="0.01"
              />
              {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                <p className="text-sm text-red-600">{getFieldMessage(field.state.meta.errors[0])}</p>
              )}
            </div>
          )}
        </form.Field>


        <form.Field
          name="isActive"
          validators={{
            onChange: ({ value }) => {
              const result = updateEventValidationSchema.shape.isActive.safeParse(value);
              return result.success ? undefined : result.error.issues[0]?.message;
            },
          }}
        >
          {(field) => (
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <input
                  id="isActive"
                  type="checkbox"
                  checked={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.checked)}
                  disabled={isLoading}
                  className="rounded"
                />
                Active
              </Label>
              {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                <p className="text-sm text-red-600">{getFieldMessage(field.state.meta.errors[0])}</p>
              )}
            </div>
          )}
        </form.Field>

        {event.images && event.images.length > 0 && (
          <div className="space-y-2">
            <Label>Current Images</Label>
            <div className="grid grid-cols-3 gap-3">
              {event.images.map((image, index) => (
                <div
                  key={index}
                  className={`relative cursor-pointer ${
                    imagesToDelete.includes(image) ? "opacity-50" : "opacity-100"
                  }`}
                  onClick={() => toggleImageDelete(image)}
                >
                  <img
                    src={image}
                    alt={`Event image ${index + 1}`}
                    className="w-full h-24 object-cover rounded border"
                  />
                  {imagesToDelete.includes(image) && (
                    <div className="absolute inset-0 flex items-center justify-center bg-red-500 bg-opacity-75 rounded">
                      <span className="text-white text-xs font-bold">DELETE</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-600">Click on an image to mark for deletion</p>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="new-images">Add New Images</Label>
          <Input
            id="new-images"
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            disabled={isLoading}
          />
          {selectedFiles.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                {selectedFiles.length} new file(s) selected
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
            {isLoading ? "Updating..." : "Update Event"}
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
