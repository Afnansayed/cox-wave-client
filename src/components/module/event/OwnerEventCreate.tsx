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
          <div className="flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-[0.2em] mb-1">
            <Plus size={14} /> New Experience
          </div>
          <h1 className="text-3xl font-black tracking-tight text-foreground">List Your Event</h1>
          <p className="text-muted-foreground text-sm font-medium">Reach thousands of travelers in Cox's Bazar.</p>
        </div>
        <Button variant="outline" onClick={() => router.back()} className="rounded-xl h-10 border-border bg-background shadow-sm font-bold text-xs uppercase tracking-widest">
          <ArrowLeft className="mr-2 h-3.5 w-3.5" /> Back
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
            <div className="bg-card rounded-[2rem] border border-border p-6 md:p-8 shadow-sm space-y-8">
              <h3 className="text-[10px] font-black text-foreground uppercase tracking-[0.2em]">Listing Details</h3>
              
              <form.Field
                name="title"
                validators={{ onChange: createEventValidationSchema.shape.title }}
              >
                {(field) => (
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-[10px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                      <Type size={14} className="text-primary" /> Title of Experience
                    </Label>
                    <Input
                      id="title"
                      placeholder="e.g. Luxury Private Yacht Sunset Cruise"
                      className={cn("h-12 bg-muted/30 border-border rounded-xl font-medium text-foreground", field.state.meta.errors.length > 0 && "border-destructive")}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      disabled={isLoading}
                    />
                    {field.state.meta.errors.length > 0 && (
                      <p className="text-xs font-bold text-destructive">{getFirstError(field.state.meta.errors[0])}</p>
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
                    <Label htmlFor="description" className="text-[10px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                      <AlignLeft size={14} className="text-primary" /> Story & Highlights
                    </Label>
                    <Textarea
                      id="description"
                      placeholder="Describe what makes this experience special..."
                      className={cn("min-h-[180px] bg-muted/30 border-border rounded-2xl p-4 font-medium text-foreground resize-none", field.state.meta.errors.length > 0 && "border-destructive")}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      disabled={isLoading}
                    />
                    {field.state.meta.errors.length > 0 && (
                      <p className="text-xs font-bold text-destructive">{getFirstError(field.state.meta.errors[0])}</p>
                    )}
                  </div>
                )}
              </form.Field>
            </div>

            {/* Media Upload Section */}
            <div className="bg-card rounded-[2rem] border border-border p-6 md:p-8 shadow-sm space-y-8">
              <h3 className="text-[10px] font-black text-foreground uppercase tracking-[0.2em]">Visual Gallery</h3>
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="group cursor-pointer flex flex-col items-center justify-center p-12 border-2 border-dashed border-border rounded-[2.5rem] bg-muted/30 hover:bg-muted/50 hover:border-primary/50 transition-all duration-300"
              >
                <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform mb-4">
                  <UploadCloud size={28} />
                </div>
                <p className="text-sm font-black text-foreground uppercase tracking-widest">Select Visuals</p>
                <p className="text-[10px] text-muted-foreground font-medium mt-1 uppercase tracking-wider">JPG, PNG up to 10MB each</p>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} multiple accept="image/*" className="hidden" />
              </div>
              {selectedFiles.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {selectedFiles.map((file, index) => (
                    <div key={index} className="group relative aspect-video rounded-2xl border border-border bg-muted overflow-hidden">
                      <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-muted-foreground p-3 truncate bg-background/40 backdrop-blur-sm">
                        {file.name}
                      </div>
                      <Button 
                        type="button" 
                        variant="destructive" 
                        size="icon" 
                        onClick={() => removeFile(index)} 
                        className="absolute top-2 right-2 h-7 w-7 rounded-xl shadow-lg opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100"
                      >
                        <X size={14} />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Logistics Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-neutral-900 rounded-[2rem] p-6 md:p-8 text-white space-y-8 shadow-2xl shadow-black/20 border border-white/5">
              <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">Logistics Hub</h3>

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
                  <div className="space-y-3">
                    <Label className="text-[10px] font-black text-white/60 uppercase tracking-widest flex items-center gap-2">
                      <MapPin size={12} className="text-primary" /> Venue Location
                    </Label>
                    <Input
                      placeholder="e.g. Inani Beach, Marine Drive"
                      className={cn("bg-white/5 border-white/10 text-white rounded-xl h-12 font-medium placeholder:text-white/20 focus-visible:ring-primary/20", field.state.meta.errors.length > 0 && "border-destructive")}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                    {field.state.meta.errors.length > 0 && (
                      <p className="text-[10px] font-bold text-destructive/80 uppercase tracking-tight">{getFirstError(field.state.meta.errors[0])}</p>
                    )}
                  </div>
                )}
              </form.Field>

              <form.Field
                name="capacity"
                validators={{ onChange: createEventValidationSchema.shape.capacity }}
              >
                {(field) => (
                  <div className="space-y-3">
                    <Label className="text-[10px] font-black text-white/60 uppercase tracking-widest flex items-center gap-2">
                      <Users size={12} className="text-primary" /> Max Participants
                    </Label>
                    <Input
                      type="number"
                      placeholder="0"
                      className={cn("bg-white/5 border-white/10 text-white rounded-xl h-12 font-medium placeholder:text-white/20 focus-visible:ring-primary/20", field.state.meta.errors.length > 0 && "border-destructive")}
                      value={field.state.value ?? ""}
                      onChange={(e) => field.handleChange(e.target.value === "" ? undefined : Number(e.target.value))}
                    />
                    {field.state.meta.errors.length > 0 && (
                      <p className="text-[10px] font-bold text-destructive/80 uppercase tracking-tight">{getFirstError(field.state.meta.errors[0])}</p>
                    )}
                  </div>
                )}
              </form.Field>

              <form.Field
                name="per_person_price"
                validators={{ onChange: createEventValidationSchema.shape.per_person_price }}
              >
                {(field) => (
                  <div className="space-y-3">
                    <Label className="text-[10px] font-black text-white/60 uppercase tracking-widest flex items-center gap-2">
                      <Wallet size={12} className="text-primary" /> Unit Price (BDT)
                    </Label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 font-bold text-sm">৳</span>
                      <Input
                        type="number"
                        step="1"
                        placeholder="0"
                        className={cn("bg-white/5 border-white/10 text-white rounded-xl h-12 pl-8 font-black text-lg placeholder:text-white/20 focus-visible:ring-primary/20", field.state.meta.errors.length > 0 && "border-destructive")}
                        value={field.state.value ?? ""}
                        onChange={(e) => field.handleChange(e.target.value === "" ? undefined : Number(e.target.value))}
                      />
                    </div>
                    {field.state.meta.errors.length > 0 && (
                      <p className="text-[10px] font-bold text-destructive/80 uppercase tracking-tight">{getFirstError(field.state.meta.errors[0])}</p>
                    )}
                  </div>
                )}
              </form.Field>

              <div className="pt-6">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-14 rounded-2xl bg-primary text-primary-foreground font-black uppercase tracking-[0.2em] text-xs hover:bg-primary/90 transition-all shadow-xl shadow-primary/20"
                >
                  {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Publish Listing"}
                </Button>
                <p className="text-[9px] text-center text-white/30 uppercase tracking-widest mt-4 font-bold">Approved by Admin instantly</p>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}