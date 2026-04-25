"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import { 
  Plus, X, MapPin, Users, Wallet, Type, 
  AlignLeft, ArrowLeft, Loader2, UploadCloud
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createEvent } from "@/components/services/event.service";
import { createEventValidationSchema } from "@/zod/event.validation";
import { cn } from "@/lib/utils";
import { getFirstError } from "@/lib/getFirstError";



export function OwnerEventCreate() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
        if (parsed.data.description?.trim()) formData.append("description", parsed.data.description.trim());
        if (parsed.data.location?.trim()) formData.append("location", parsed.data.location.trim());
        formData.append("capacity", String(parsed.data.capacity));
        formData.append("per_person_price", String(parsed.data.per_person_price));

        selectedFiles.forEach((file) => formData.append("images", file));

        const response = await createEvent(formData);

        if (response.success) {
          toast.success("Event created successfully!");
          // Use push with a slight delay to ensure toast is seen and state settles
          setTimeout(() => {
            router.push("/owner-dashboard/event");
          }, 100);
        }
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Failed to create event");
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

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="w-full  mx-auto py-8 px-4 md:px-6">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-primary font-medium text-xs uppercase tracking-widest mb-1">
            <Plus size={14} /> New Listing
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Create Event</h1>
        </div>
        <Button variant="outline" onClick={() => router.back()} className="rounded-xl h-10 border-slate-200">
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
          {/* Main Details */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white rounded-[2rem] border border-slate-100 p-6 md:p-8 shadow-sm space-y-6">
              <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-2">General Information</h3>
              
              <form.Field
                name="title"
                validators={{ onChange: createEventValidationSchema.shape.title }}
              >
                {(field) => (
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                      <Type size={14} className="text-slate-400" /> Event Title *
                    </Label>
                    <Input
                      id="title"
                      placeholder="e.g. Summer Beach Party 2026"
                      className={cn("h-12 bg-slate-50/50 rounded-xl", field.state.meta.errors.length > 0 && "border-rose-500")}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      disabled={isLoading}
                    />
                    {field.state.meta.errors.length > 0 && (
                      <p className="text-xs font-medium text-rose-500">{getFirstError(field.state.meta.errors[0])}</p>
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
                    <Label htmlFor="description" className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                      <AlignLeft size={14} className="text-slate-400" /> Description
                    </Label>
                    <Textarea
                      id="description"
                      placeholder="Describe the experience..."
                      className={cn("min-h-[160px] bg-slate-50/50 rounded-2xl p-4", field.state.meta.errors.length > 0 && "border-rose-500")}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      disabled={isLoading}
                    />
                    {field.state.meta.errors.length > 0 && (
                      <p className="text-xs font-medium text-rose-500">{getFirstError(field.state.meta.errors[0])}</p>
                    )}
                  </div>
                )}
              </form.Field>
            </div>

            {/* Media Upload Section */}
            <div className="bg-white rounded-[2rem] border border-slate-100 p-6 md:p-8 shadow-sm space-y-6">
              <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">Event Media</h3>
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="group cursor-pointer flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50 hover:border-primary/50 transition-all"
              >
                <UploadCloud size={24} className="text-slate-400 group-hover:text-primary mb-4" />
                <p className="text-sm font-semibold text-slate-700">Click to upload images</p>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} multiple accept="image/*" className="hidden" />
              </div>
              {selectedFiles.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {selectedFiles.map((file, index) => (
                    <div key={index} className="group relative aspect-video rounded-2xl border bg-slate-50 overflow-hidden">
                      <div className="absolute inset-0 flex items-center justify-center text-[10px] text-slate-400 p-2 truncate">{file.name}</div>
                      <Button type="button" variant="destructive" size="icon" onClick={() => removeFile(index)} className="absolute top-2 right-2 h-6 w-6 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                        <X size={12} />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Logistics Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-slate-900 rounded-[2rem] p-6 md:p-8 text-white space-y-6 shadow-xl">
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Logistics & Pricing</h3>

              {/* Location Error Fixed */}
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
                    <Label className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-2">
                      <MapPin size={12} /> Venue Location
                    </Label>
                    <Input
                      placeholder="City, Area or Link"
                      className={cn("bg-white/10 border-white/10 text-white rounded-xl h-11", field.state.meta.errors.length > 0 && "border-rose-500")}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                    {field.state.meta.errors.length > 0 && (
                      <p className="text-xs font-medium text-rose-400">{getFirstError(field.state.meta.errors[0])}</p>
                    )}
                  </div>
                )}
              </form.Field>

              {/* Capacity Error Fixed */}
              <form.Field
                name="capacity"
                validators={{ onChange: createEventValidationSchema.shape.capacity }}
              >
                {(field) => (
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-2">
                      <Users size={12} /> Capacity *
                    </Label>
                    <Input
                      type="number"
                      placeholder="0"
                      className={cn("bg-white/10 border-white/10 text-white rounded-xl h-11", field.state.meta.errors.length > 0 && "border-rose-500")}
                      value={field.state.value ?? ""}
                      onChange={(e) => field.handleChange(e.target.value === "" ? undefined : Number(e.target.value))}
                    />
                    {field.state.meta.errors.length > 0 && (
                      <p className="text-xs font-medium text-rose-400">{getFirstError(field.state.meta.errors[0])}</p>
                    )}
                  </div>
                )}
              </form.Field>

              {/* Price Error Fixed */}
              <form.Field
                name="per_person_price"
                validators={{ onChange: createEventValidationSchema.shape.per_person_price }}
              >
                {(field) => (
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-2">
                      <Wallet size={12} /> Price / Person *
                    </Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 text-sm">$</span>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        className={cn("bg-white/10 border-white/10 text-white rounded-xl h-11 pl-7", field.state.meta.errors.length > 0 && "border-rose-500")}
                        value={field.state.value ?? ""}
                        onChange={(e) => field.handleChange(e.target.value === "" ? undefined : Number(e.target.value))}
                      />
                    </div>
                    {field.state.meta.errors.length > 0 && (
                      <p className="text-xs font-medium text-rose-400">{getFirstError(field.state.meta.errors[0])}</p>
                    )}
                  </div>
                )}
              </form.Field>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 rounded-2xl bg-white text-slate-900 font-bold hover:bg-slate-100 transition-all shadow-lg"
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Publish Event"}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}