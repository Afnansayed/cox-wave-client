"use client";

import { useState, useRef } from "react";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import { 
  User, 
  Phone, 
  MapPin, 
  Camera, 
  Loader2, 
  Save, 
  X
} from "lucide-react";

import { IAdmin } from "@/types/account.types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { updateAdminProfile } from "@/components/services/user.service";
import { updateProfileSchema } from "@/zod/user.validation";
import { useRouter } from "next/navigation";

const getFieldError = (error: unknown) => {
  if (!error) return "";
  if (typeof error === "string") return error;
  if (error instanceof Error) return error.message;

  if (typeof error === "object") {
    const maybeMessage = (error as { message?: unknown }).message;
    if (typeof maybeMessage === "string") return maybeMessage;
  }

  return "Invalid input";
};



const UpdateAdminProfile = ({ admin }: { admin: IAdmin }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(admin?.profile_picture || null);
  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // 2. TanStack Form Setup
  const form = useForm({
    defaultValues: {
      name: admin.name || "",
      phone_number: admin.phone_number || "",
      address: admin.address || "",
    },
    onSubmit: async ({ value }) => {
      try {
        setIsLoading(true);

        // 3. Prepare FormData according to your API requirements
        const formData = new FormData();
        
        // Nested JSON data as requested: { "data": "{...}" }
        formData.append("data", JSON.stringify(value));

        if (profilePictureFile) {
          formData.append("profile_picture", profilePictureFile);
        }

        // Replace with your actual API service call
        const response = await updateAdminProfile(formData);

        if (!response.success) {
           toast.error(response.message || "Failed to update profile");
        }
        
        toast.success(response.message || "Profile updated successfully");
        // Simulating API call
        await new Promise((resolve) => setTimeout(resolve, 2000));

        router.push("/admin-dashboard/account");
    
      } catch (error) {
        toast.error("Failed to update profile");
      } finally {
        setIsLoading(false);
      }
    },
  });

  // 4. Handle Image Preview
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePictureFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const removeSelectedImage = () => {
    setProfilePictureFile(null);
    setPreviewUrl(admin?.profile_picture || null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="w-full max-w-2xl mx-auto py-6 px-4">
      <div className="mb-8 space-y-1">
        <h2 className="text-2xl font-bold text-slate-900">Edit Profile</h2>
        <p className="text-sm text-slate-500">Update your personal information and profile picture.</p>
      </div>

      {/* Profile Picture Section (Outside Form but handled in onSubmit) */}
      <div className="flex flex-col items-center mb-8 sm:flex-row sm:gap-6">
        <div className="relative group">
          <div className="h-32 w-32 rounded-[2.5rem] border-4 border-white bg-slate-100 overflow-hidden shadow-lg transition-transform group-hover:scale-[1.02]">
            {previewUrl ? (
              <img src={previewUrl} alt="Preview" className="h-full w-full object-cover" />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-slate-400">
                <User size={48} />
              </div>
            )}
          </div>
          
          <button 
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="absolute bottom-1 right-1 p-2.5 bg-primary text-white rounded-2xl border-4 border-white shadow-lg hover:bg-primary/90 transition-all"
          >
            <Camera size={18} />
          </button>

          {profilePictureFile && (
            <button 
              onClick={removeSelectedImage}
              className="absolute -top-2 -right-2 p-1.5 bg-rose-500 text-white rounded-full border-2 border-white shadow-md hover:bg-rose-600 transition-all"
            >
              <X size={14} />
            </button>
          )}
        </div>

        <div className="mt-4 text-center sm:mt-0 sm:text-left">
          <p className="text-sm font-semibold text-slate-700">Profile Photo</p>
          <p className="text-xs text-slate-500 mt-1">JPG, GIF or PNG. Max size of 2MB.</p>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImageChange} 
            accept="image/*" 
            className="hidden" 
          />
        </div>
      </div>

      {/* Main Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="space-y-5"
      >
        {/* Name Field */}
        <form.Field
          name="name"
          validators={{
            onChange: ({ value }) => {
              const result = updateProfileSchema.shape.name.safeParse(value || undefined);
              return result.success ? undefined : result.error.issues[0]?.message;
            },
          }}
        >
          {(field) => (
            <div className="space-y-2">
              <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 px-1">
                <User size={12} /> Full Name
              </Label>
              <Input
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="Afnan Sayed Fahim"
                className={cn(
                  "h-12 bg-slate-50/50 border-slate-200 rounded-xl px-4 focus:ring-primary",
                  field.state.meta.errors.length > 0 && "border-rose-500"
                )}
              />
              {field.state.meta.errors.length > 0 && (
                <p className="text-[10px] font-medium text-rose-500 px-1">
                  {getFieldError(field.state.meta.errors[0])}
                </p>
              )}
            </div>
          )}
        </form.Field>

        {/* Phone Number Field */}
        <form.Field
          name="phone_number"
          validators={{
            onChange: ({ value }) => {
              const result = updateProfileSchema.shape.phone_number.safeParse(value || undefined);
              return result.success ? undefined : result.error.issues[0]?.message;
            },
          }}
        >
          {(field) => (
            <div className="space-y-2">
              <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 px-1">
                <Phone size={12} /> Phone Number
              </Label>
              <Input
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="01864079790"
                className={cn(
                  "h-12 bg-slate-50/50 border-slate-200 rounded-xl px-4",
                  field.state.meta.errors.length > 0 && "border-rose-500"
                )}
              />
              {field.state.meta.errors.length > 0 && (
                <p className="text-[10px] font-medium text-rose-500 px-1">
                  {getFieldError(field.state.meta.errors[0])}
                </p>
              )}
            </div>
          )}
        </form.Field>

        {/* Address Field */}
        <form.Field
          name="address"
          validators={{
            onChange: ({ value }) => {
              const result = updateProfileSchema.shape.address.safeParse(value || undefined);
              return result.success ? undefined : result.error.issues[0]?.message;
            },
          }}
        >
          {(field) => (
            <div className="space-y-2">
              <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 px-1">
                <MapPin size={12} /> Address
              </Label>
              <Input
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="Cox's Bazar, Bangladesh"
                className={cn(
                  "h-12 bg-slate-50/50 border-slate-200 rounded-xl px-4",
                  field.state.meta.errors.length > 0 && "border-rose-500"
                )}
              />
              {field.state.meta.errors.length > 0 && (
                <p className="text-[10px] font-medium text-rose-500 px-1">
                  {getFieldError(field.state.meta.errors[0])}
                </p>
              )}
            </div>
          )}
        </form.Field>

        <div className="pt-4 flex gap-3">
          <Button
            type="submit"
            disabled={isLoading || !form.state.canSubmit}
            className="flex-1 h-12 rounded-2xl bg-primary text-white hover:bg-primary/90 transition-all font-bold gap-2"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                <Save size={18} /> Update Profile
              </>
            )}
          </Button>
          
          <Button 
            type="button" 
            variant="outline" 
            className="rounded-2xl h-12 px-6 border-slate-200"
            onClick={() => form.reset()}
          >
            Reset
          </Button>
        </div>
      </form>
    </div>
  );
};

export default UpdateAdminProfile;