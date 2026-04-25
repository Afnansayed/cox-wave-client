"use client";

import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { toast } from "sonner";
import { 
  Star, 
  MessageSquare, 
  Send, 
  X, 
  Plus, 
  Loader2, 
  CheckCircle2 
} from "lucide-react";

import { useAppSelector } from "@/components/Redux/hooks";
import { useCurrentUserInfo } from "@/components/Redux/Slice/authSlice";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

// 1. Zod Validation Schema
const reviewSchema = z.object({
  rating: z.number().min(1, "Please select at least 1 star").max(5),
  comment: z.string().min(10, "Comment must be at least 10 characters long"),
});

interface ICreateReviewProps {
  eventId: string;
  title: string;
}

const CreateReview: React.FC<ICreateReviewProps> = ({ eventId, title }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const userInfo = useAppSelector(useCurrentUserInfo);

  // 2. TanStack Form Setup
  const form = useForm({
    defaultValues: {
      rating: 0,
      comment: "",
    },
    onSubmit: async ({ value }) => {
      try {
        setIsLoading(true);
        
        // Prepare the payload
        const payload = {
          eventId,
          rating: value.rating,
          comment: value.comment,
        };

        // Replace with your actual API call
        // await createReviewApi(payload);
        
        console.log("Submitting Review:", payload);
        await new Promise((resolve) => setTimeout(resolve, 1500));

        toast.success("Review published successfully!");
        form.reset();
        setIsExpanded(false);
      } catch (error) {
        toast.error("Failed to post review. Please try again.");
      } finally {
        setIsLoading(false);
      }
    },
  });

  // Role Protection
  if (!userInfo || userInfo.role !== "CUSTOMER") {
    return null;
  }

  return (
    <div className="w-full  mx-auto my-6 px-1">
      {!isExpanded ? (
        /* Trigger Button */
        <Button
          onClick={() => setIsExpanded(true)}
          className="group w-full md:w-auto h-10 px-4 rounded-2xl bg-primary text-white hover:bg-primary/90 transition-all flex items-center gap-3 shadow-lg shadow-slate-200"
        >
          <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" />
          <span className="font-bold tracking-tight">Write a Review</span>
        </Button>
      ) : (
        /* Review Form Card */
        <div className="bg-white rounded-[2rem] border border-slate-100 p-6 md:p-8 shadow-xl shadow-slate-100 animate-in fade-in zoom-in-95 duration-300">
          <div className="flex items-center justify-between mb-6">
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-900">Reviewing Event</h3>
              <p className="text-xs text-slate-500 font-medium truncate max-w-[200px] md:max-w-md">
                {title}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsExpanded(false)}
              className="rounded-full hover:bg-slate-50 text-slate-400"
            >
              <X size={20} />
            </Button>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
            className="space-y-6"
          >
            {/* Star Rating Field */}
            <form.Field
              name="rating"
              validators={{ onChange: reviewSchema.shape.rating }}
            >
              {(field) => (
                <div className="space-y-3 text-center md:text-left">
                  <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] px-1">
                    Your Rating
                  </Label>
                  <div className="flex items-center justify-center md:justify-start gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => field.handleChange(star)}
                        className="transition-transform active:scale-90"
                      >
                        <Star
                          size={32}
                          className={cn(
                            "transition-colors duration-200",
                            field.state.value >= star
                              ? "fill-amber-400 text-amber-400"
                              : "text-slate-200 fill-slate-50"
                          )}
                        />
                      </button>
                    ))}
                  </div>
                  {field.state.meta.errors.length > 0 && (
                    <p className="text-[10px] font-medium text-rose-500 px-1">
                      {field.state.meta.errors[0]?.toString()}
                    </p>
                  )}
                </div>
              )}
            </form.Field>

            {/* Comment Field */}
            <form.Field
              name="comment"
              validators={{ onChange: reviewSchema.shape.comment }}
            >
              {(field) => (
                <div className="space-y-3">
                  <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] px-1 flex items-center gap-2">
                    <MessageSquare size={12} /> Your Experience
                  </Label>
                  <Textarea
                    placeholder="Tell others what you thought about the experience..."
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className={cn(
                      "min-h-[120px] bg-slate-50/50 border-slate-200 rounded-2xl resize-none p-4 text-sm focus:ring-primary",
                      field.state.meta.errors.length > 0 && "border-rose-500"
                    )}
                  />
                  <div className="flex justify-between items-center px-1">
                    {field.state.meta.errors.length > 0 ? (
                      <p className="text-[10px] font-medium text-rose-500">
                        {field.state.meta.errors[0]?.toString()}
                      </p>
                    ) : (
                      <div />
                    )}
                    <span className="text-[10px] text-slate-400 font-medium">
                      {field.state.value.length} characters
                    </span>
                  </div>
                </div>
              )}
            </form.Field>

            {/* Submit Button */}
            <div className="flex flex-col md:flex-row gap-3 pt-2">
              <Button
                type="submit"
                disabled={isLoading || !form.state.canSubmit}
                className="flex-1 h-12 rounded-2xl bg-primary text-white hover:bg-primary/90 transition-all font-bold gap-2 shadow-lg shadow-slate-100"
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    <Send size={18} /> Publish Review
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsExpanded(false)}
                className="h-12 rounded-2xl px-8 border-slate-200 font-bold text-slate-600"
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default CreateReview;