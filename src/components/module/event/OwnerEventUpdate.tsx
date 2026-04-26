"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import { 
  X, 
  MapPin, 
  Users, 
  Wallet, 
  Type, 
  AlignLeft, 
  ArrowLeft,
  Loader2,
  UploadCloud,
  Save,
  Trash2,
  RefreshCcw,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { updateEvent } from "@/components/services/event.service";
import {
  updateEventValidationSchema,
  type UpdateEventFormData,
} from "@/zod/event.validation";
import { IEvent } from "@/types/event.types";
import { cn } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";

type OwnerEventUpdateProps = {
  event: IEvent;
};

const getFieldMessage = (message: unknown) => {
  if (!message) return "";
  if (typeof message === "string") return message;
  if (message instanceof Error) return message.message;

  if (typeof message === "object") {
    const maybeMessage = (message as { message?: unknown }).message;
    if (typeof maybeMessage === "string") return maybeMessage;
  }

  return "Invalid input";
};

export function OwnerEventUpdate({ event }: OwnerEventUpdateProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const form = useForm({
    defaultValues: {
      title: event.title ?? "",
      description: event.description ?? "",
      location: event.location ?? "",
      capacity: (event.capacity ?? undefined) as number | undefined,
      per_person_price: (event.per_person_price ?? undefined) as number | undefined,
      isActive: event.isActive,
    },
    onSubmit: async ({ value }) => {
      const parsed = updateEventValidationSchema.safeParse(value as UpdateEventFormData);

      if (!parsed.success) {
        toast.error(parsed.error.issues[0]?.message || "Please fix the form errors.");
        return;
      }

      try {
        setIsLoading(true);
        const formData = new FormData();

        if (parsed.data.title?.trim()) formData.append("title", parsed.data.title.trim());
        if (parsed.data.description?.trim()) formData.append("description", parsed.data.description.trim());
        if (parsed.data.location?.trim()) formData.append("location", parsed.data.location.trim());
        if (parsed.data.capacity !== undefined) formData.append("capacity", String(parsed.data.capacity));
        if (parsed.data.per_person_price !== undefined) formData.append("per_person_price", String(parsed.data.per_person_price));
        if (parsed.data.isActive !== undefined) formData.append("isActive", String(parsed.data.isActive));

        // Consistently handle single vs multiple deletions for backend parsers
        if (imagesToDelete.length === 1) {
          formData.append("imagesToDelete", imagesToDelete[0]);
          formData.append("imagesToDelete", imagesToDelete[0]);
        } else {
          imagesToDelete.forEach((imageUrl) => formData.append("imagesToDelete", imageUrl));
        }

        selectedFiles.forEach((file) => formData.append("images", file));

        const response = await updateEvent(event.id, formData);

        if (response.success) {
          await Promise.all([
            queryClient.invalidateQueries({ queryKey: ["events"] }),
            queryClient.invalidateQueries({ queryKey: ["event", event.id] }),
            queryClient.invalidateQueries({ queryKey: ["owner-events"] }),
            queryClient.invalidateQueries({ queryKey: ["owner-event", event.id] }),
          ]);
          toast.success("Event updated successfully!");
          router.push("/owner-dashboard/event");
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
      const newFiles = Array.from(e.target.files);
      setSelectedFiles((prev) => [...prev, ...newFiles]);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const toggleImageDelete = (imageUrl: string) => {
    setImagesToDelete((prev) =>
      prev.includes(imageUrl) ? prev.filter((url) => url !== imageUrl) : [...prev, imageUrl]
    );
  };

  return (
    <div className="w-full  mx-auto py-8 px-4 md:px-6">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-primary font-medium text-xs uppercase tracking-widest mb-1">
            <RefreshCcw size={14} />
            Edit Listing
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Update Event</h1>
          <p className="text-slate-500 text-sm">Managing: <span className="font-medium text-slate-700">{event.title}</span></p>
        </div>
        <Button 
          variant="outline" 
          onClick={() => router.back()} 
          className="rounded-xl h-10 border-slate-200 text-slate-600 hover:bg-slate-50 shadow-sm"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="space-y-8"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Content Area */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* General Info Card */}
            <div className="bg-white rounded-[2rem] border border-slate-100 p-6 md:p-8 shadow-sm space-y-6">
              <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-2">Content Details</h3>
              
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
                    <Label htmlFor="title" className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                      <Type size={14} className="text-slate-400" /> Title
                    </Label>
                    <Input
                      id="title"
                      className={cn("h-12 bg-slate-50/50 border-slate-200 rounded-xl", field.state.meta.errors.length > 0 && "border-rose-500")}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      disabled={isLoading}
                    />
                    {field.state.meta.errors.length > 0 && (
                      <p className="text-xs font-medium text-rose-500">{getFieldMessage(field.state.meta.errors[0])}</p>
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
                    <Label htmlFor="description" className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                      <AlignLeft size={14} className="text-slate-400" /> Description
                    </Label>
                    <Textarea
                      id="description"
                      className={cn("min-h-[160px] bg-slate-50/50 border-slate-200 rounded-2xl resize-none p-4", field.state.meta.errors.length > 0 && "border-rose-500")}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      disabled={isLoading}
                    />
                    {field.state.meta.errors.length > 0 && (
                      <p className="text-xs font-medium text-rose-500">{getFieldMessage(field.state.meta.errors[0])}</p>
                    )}
                  </div>
                )}
              </form.Field>
            </div>

            {/* Media Management Card */}
            <div className="bg-white rounded-[2rem] border border-slate-100 p-6 md:p-8 shadow-sm space-y-6">
              <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">Image Gallery</h3>
              
              {/* Existing Images */}
              {event.images && event.images.length > 0 && (
                <div className="space-y-4">
                  <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Current Photos (Tap to remove)</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {event.images.map((image, index) => {
                      const isMarked = imagesToDelete.includes(image);
                      return (
                        <div
                          key={index}
                          onClick={() => toggleImageDelete(image)}
                          className={cn(
                            "group relative aspect-square rounded-2xl cursor-pointer overflow-hidden border-2 transition-all",
                            isMarked ? "border-rose-500 opacity-70" : "border-slate-100 hover:border-primary/50"
                          )}
                        >
                          <img src={image} alt="Event" className="w-full h-full object-cover" />
                          <div className={cn(
                            "absolute inset-0 flex flex-col items-center justify-center transition-all bg-white/40 backdrop-blur-[2px]",
                            isMarked ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                          )}>
                            {isMarked ? (
                              <Trash2 className="text-rose-600 animate-bounce" size={24} />
                            ) : (
                              <X className="text-slate-900" size={20} />
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Upload New */}
              <div className="space-y-4">
                <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Add New Media</Label>
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="group cursor-pointer flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50 hover:bg-slate-50 transition-all"
                >
                  <UploadCloud size={24} className="text-slate-400 group-hover:text-primary mb-2" />
                  <p className="text-sm font-semibold text-slate-700">Drop more files here</p>
                  <input type="file" ref={fileInputRef} onChange={handleFileChange} multiple accept="image/*" className="hidden" />
                </div>

                {selectedFiles.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {selectedFiles.map((file, index) => (
                      <div key={index} className="flex items-center gap-2 bg-primary/5 text-primary text-[10px] font-bold px-3 py-1.5 rounded-full border border-primary/10">
                        {file.name}
                        <X size={12} className="cursor-pointer" onClick={() => setSelectedFiles(prev => prev.filter((_, i) => i !== index))} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Logistics Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-slate-900 rounded-[2rem] p-6 md:p-8 text-white space-y-6 shadow-xl shadow-slate-200">
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Listing Settings</h3>

              <form.Field name="isActive">
                {(field) => (
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                    <div className="space-y-0.5">
                      <Label className="text-xs font-bold text-white">Active Status</Label>
                      <p className="text-[10px] text-slate-400 uppercase">Visible to public</p>
                    </div>
                    <Switch
                      checked={field.state.value}
                      onCheckedChange={(checked) => field.handleChange(checked)}
                      disabled={isLoading}
                    />
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
                    <Label className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-2">
                      <MapPin size={12} /> Location
                    </Label>
                    <Input
                      className={cn("bg-white/10 border-white/10 text-white placeholder:text-white/30 rounded-xl h-11", field.state.meta.errors.length > 0 && "border-rose-500")}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                    {field.state.meta.errors.length > 0 && (
                      <p className="text-xs font-medium text-rose-400">{getFieldMessage(field.state.meta.errors[0])}</p>
                    )}
                  </div>
                )}
              </form.Field>

              <div className="grid grid-cols-1 gap-6 pt-2">
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
                      <Label className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-2">
                        <Users size={12} /> Capacity
                      </Label>
                      <Input
                        type="number"
                        className={cn("bg-white/10 border-white/10 text-white rounded-xl h-11", field.state.meta.errors.length > 0 && "border-rose-500")}
                        value={field.state.value ?? ""}
                        onChange={(e) => field.handleChange(e.target.value === "" ? undefined : Number(e.target.value))}
                      />
                      {field.state.meta.errors.length > 0 && (
                        <p className="text-xs font-medium text-rose-400">{getFieldMessage(field.state.meta.errors[0])}</p>
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
                      <Label className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-2">
                        <Wallet size={12} /> Price / Person
                      </Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 text-sm">$</span>
                        <Input
                          type="number"
                          step="0.01"
                          className={cn("bg-white/10 border-white/10 text-white rounded-xl h-11 pl-7", field.state.meta.errors.length > 0 && "border-rose-500")}
                          value={field.state.value ?? ""}
                          onChange={(e) => field.handleChange(e.target.value === "" ? undefined : Number(e.target.value))}
                        />
                      </div>
                      {field.state.meta.errors.length > 0 && (
                        <p className="text-xs font-medium text-rose-400">{getFieldMessage(field.state.meta.errors[0])}</p>
                      )}
                    </div>
                  )}
                </form.Field>
              </div>

              <div className="pt-4 flex flex-col gap-3">
                <Button
                  type="submit"
                  disabled={isLoading || !form.state.canSubmit}
                  className="w-full h-12 rounded-2xl bg-white text-slate-900 font-bold hover:bg-slate-100 transition-all shadow-lg"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <span className="flex items-center gap-2"><Save size={16} /> Save Changes</span>
                  )}
                </Button>
              </div>
            </div>

            {/* Status Indicator */}
            <div className={cn(
              "rounded-2xl p-4 flex items-start gap-3 border",
              event.isActive ? "bg-emerald-50 border-emerald-100" : "bg-amber-50 border-amber-100"
            )}>
              {event.isActive ? (
                <CheckCircle2 size={18} className="text-emerald-600 mt-0.5" />
              ) : (
                <AlertCircle size={18} className="text-amber-600 mt-0.5" />
              )}
              <div className="space-y-1">
                <p className={cn("text-xs font-bold uppercase", event.isActive ? "text-emerald-700" : "text-amber-700")}>
                  {event.isActive ? "Live Listing" : "Paused Listing"}
                </p>
                <p className="text-[10px] leading-relaxed text-slate-600">
                  {event.isActive 
                    ? "Customers can see and book this event immediately." 
                    : "This event is currently hidden from the public marketplace."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}