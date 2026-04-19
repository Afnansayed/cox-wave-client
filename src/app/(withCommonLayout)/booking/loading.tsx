import { Skeleton } from "@/components/ui/skeleton";

const BookingSkeleton = () => {
  return (
    <div className="min-h-screen bg-neutral-50/50 py-12 px-4">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* 1. Back Button Skeleton */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4 rounded-full" />
          <Skeleton className="h-4 w-32 rounded-md" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          
          {/* LEFT COLUMN: Event Summary Skeleton */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl border border-neutral-100 overflow-hidden shadow-sm">
              {/* Image Skeleton */}
              <Skeleton className="aspect-video w-full rounded-none" />
              
              <div className="p-6 space-y-4">
                <div className="space-y-2">
                  <Skeleton className="h-6 w-3/4 rounded-md" /> {/* Title */}
                  <Skeleton className="h-4 w-1/2 rounded-md" />  {/* Location */}
                </div>

                <div className="pt-4 border-t border-neutral-50 space-y-4">
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-20 rounded-md" />
                    <Skeleton className="h-4 w-16 rounded-md" />
                  </div>
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-24 rounded-md" />
                    <Skeleton className="h-4 w-12 rounded-md" />
                  </div>
                </div>
              </div>
            </div>

            {/* Trust Badge Skeleton */}
            <div className="p-6 bg-white rounded-3xl border border-neutral-100 flex gap-3">
              <Skeleton className="h-10 w-10 rounded-xl shrink-0" />
              <div className="space-y-2 w-full">
                <Skeleton className="h-3 w-1/3 rounded-md" />
                <Skeleton className="h-3 w-full rounded-md" />
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Form Skeleton */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-[2rem] border border-neutral-100 p-8 md:p-10 shadow-sm space-y-8">
              {/* Header Skeleton */}
              <div className="space-y-2">
                <Skeleton className="h-8 w-1/2 rounded-lg" />
                <Skeleton className="h-4 w-1/3 rounded-md" />
              </div>

              {/* Form Fields Skeleton */}
              <div className="space-y-8">
                {/* Field 1 */}
                <div className="space-y-3">
                  <Skeleton className="h-3 w-24 rounded-md" />
                  <Skeleton className="h-12 w-full rounded-xl" />
                </div>

                {/* Field 2 */}
                <div className="space-y-3">
                  <Skeleton className="h-3 w-20 rounded-md" />
                  <Skeleton className="h-14 w-full rounded-2xl" />
                </div>

                {/* Price Card Skeleton */}
                <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-100 space-y-4">
                  <div className="flex justify-between">
                    <Skeleton className="h-3 w-16 rounded-md" />
                    <Skeleton className="h-3 w-24 rounded-md" />
                  </div>
                  <div className="flex justify-between items-end">
                    <Skeleton className="h-10 w-32 rounded-lg" />
                    <Skeleton className="h-6 w-6 rounded-full" />
                  </div>
                </div>

                {/* Button Skeleton */}
                <Skeleton className="h-16 w-full rounded-2xl" />
                
                {/* Footer Text */}
                <center>
                  <Skeleton className="h-3 w-2/3 rounded-md" />
                </center>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default BookingSkeleton;