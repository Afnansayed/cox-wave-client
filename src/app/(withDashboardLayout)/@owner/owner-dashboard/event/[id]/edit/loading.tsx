import { Skeleton } from "@/components/ui/skeleton";

export default function EditEventLoading() {
  return (
    <div className="max-w-2xl mx-auto p-6">
      <Skeleton className="h-10 w-48 mb-6" />
      
      <div className="space-y-6">
        {/* Title Field */}
        <div className="space-y-2">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-10 w-full" />
        </div>

        {/* Description Field */}
        <div className="space-y-2">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-24 w-full" />
        </div>

        {/* Location Field */}
        <div className="space-y-2">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-10 w-full" />
        </div>

        {/* Capacity Field */}
        <div className="space-y-2">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-10 w-full" />
        </div>

        {/* Price Field */}
        <div className="space-y-2">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-10 w-full" />
        </div>

        {/* Status Field */}
        <div className="space-y-2">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-10 w-full" />
        </div>

        {/* Active Checkbox */}
        <div className="space-y-2">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-5 w-5" />
        </div>

        {/* Current Images */}
        <div className="space-y-2">
          <Skeleton className="h-5 w-32" />
          <div className="grid grid-cols-3 gap-3">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
        </div>

        {/* Add New Images */}
        <div className="space-y-2">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-10 w-full" />
        </div>

        {/* Buttons */}
        <div className="flex gap-4">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 flex-1" />
        </div>
      </div>
    </div>
  );
}
