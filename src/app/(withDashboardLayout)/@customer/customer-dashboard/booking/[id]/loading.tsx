import { cn } from "@/lib/utils";

const BookingDetailsSkeleton = () => {
  return (
    <div className="container-max mx-auto space-y-6 md:space-y-8 p-4 md:p-0 animate-pulse">
      
      {/* --- HEADER ACTIONS SKELETON --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start md:items-center gap-3 md:gap-4">
          <div className="h-10 w-10 rounded-full bg-secondary/10 flex-shrink-0" />
          <div className="space-y-2">
            <div className="h-8 w-48 md:w-64 bg-secondary/20 rounded-xl" />
            <div className="h-4 w-32 bg-secondary/10 rounded" />
          </div>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="flex-1 md:flex-none h-11 w-full md:w-28 bg-secondary/10 rounded-xl" />
          <div className="flex-1 md:flex-none h-11 w-full md:w-24 bg-secondary/10 rounded-xl" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        
        {/* --- LEFT COLUMN SKELETON --- */}
        <div className="lg:col-span-2 space-y-6 md:space-y-8">
          
          {/* Main Event Card Skeleton */}
          <div className="bg-white rounded-[1.5rem] md:rounded-[2.5rem] border border-secondary/10 overflow-hidden shadow-sm">
            <div className="p-5 md:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="space-y-3">
                  <div className="h-5 w-24 bg-primary/10 rounded-lg" />
                  <div className="h-8 w-full sm:w-80 bg-secondary/20 rounded-xl" />
                </div>
                <div className="h-10 w-24 bg-secondary/10 rounded-lg" />
              </div>

              {/* Image Placeholders */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                <div className="aspect-[16/10] sm:aspect-video rounded-xl md:rounded-2xl bg-secondary/5" />
                <div className="aspect-[16/10] sm:aspect-video rounded-xl md:rounded-2xl bg-secondary/5" />
              </div>

              {/* Details Grid Placeholder */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 pt-2 md:pt-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="space-y-2 p-3 sm:p-0">
                    <div className="h-3 w-16 bg-secondary/10 rounded" />
                    <div className="h-5 w-24 bg-secondary/20 rounded" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Payment Summary Skeleton */}
          <div className="bg-white rounded-[1.5rem] md:rounded-[2.5rem] border border-secondary/10 p-5 md:p-8 shadow-sm">
            <div className="flex justify-between mb-8">
              <div className="h-6 w-40 bg-secondary/20 rounded-lg" />
              <div className="h-6 w-16 bg-secondary/10 rounded-md" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              <div className="h-24 bg-secondary/5 rounded-2xl border border-secondary/10" />
              <div className="space-y-4">
                <div className="h-4 w-full bg-secondary/5 rounded" />
                <div className="h-4 w-full bg-secondary/5 rounded" />
                <div className="h-4 w-3/4 bg-secondary/5 rounded" />
              </div>
            </div>
          </div>
        </div>

        {/* --- RIGHT COLUMN SKELETON --- */}
        <div className="space-y-6 md:space-y-8">
          {/* Timeline Skeleton */}
          <div className="bg-white rounded-[1.5rem] md:rounded-[2.5rem] border border-secondary/10 p-6 md:p-8 shadow-sm">
            <div className="h-6 w-32 bg-secondary/20 rounded-lg mb-8" />
            <div className="space-y-8 relative pl-8">
              <div className="space-y-2">
                <div className="h-3 w-20 bg-secondary/10 rounded" />
                <div className="h-4 w-32 bg-secondary/20 rounded" />
              </div>
              <div className="space-y-2">
                <div className="h-3 w-20 bg-secondary/10 rounded" />
                <div className="h-4 w-32 bg-secondary/20 rounded" />
              </div>
            </div>
          </div>

          {/* Help Box Skeleton */}
          <div className="h-32 bg-primary/5 rounded-2xl md:rounded-[2rem] border border-primary/10" />
        </div>

      </div>
    </div>
  );
};

export default BookingDetailsSkeleton;
