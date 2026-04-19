import { Skeleton } from "@/components/ui/skeleton";




export default function EventDetailsSkeleton() {
  return (
    <main className="min-h-screen bg-white pb-12">
      
      {/* NAV */}
      <div className="sticky top-0 z-50 bg-white border-b border-neutral-100">
        <div className="max-w-5xl mx-auto h-14 px-4 flex justify-between items-center">
          <Skeleton className="h-6 w-16" />
          <div className="flex gap-2">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 pt-6 space-y-10">

        {/* GALLERY */}
        <Skeleton className="w-full aspect-[21/10] rounded-3xl" />

        {/* HEADER */}
        <div className="space-y-4">
          <Skeleton className="h-4 w-20 rounded-full" />
          <Skeleton className="h-10 w-3/4" />
          
          <div className="flex gap-2">
            <Skeleton className="h-6 w-24 rounded-xl" />
            <Skeleton className="h-6 w-24 rounded-xl" />
            <Skeleton className="h-6 w-24 rounded-xl" />
          </div>
        </div>

        {/* DESCRIPTION */}
        <div className="space-y-3">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-5/6" />
          <Skeleton className="h-3 w-4/6" />
        </div>

        {/* OWNER */}
        <div className="p-6 rounded-3xl bg-neutral-900 flex gap-6 items-center">
          <Skeleton className="h-16 w-16 rounded-2xl bg-neutral-700" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-40 bg-neutral-700" />
            <Skeleton className="h-3 w-64 bg-neutral-700" />
            <Skeleton className="h-3 w-48 bg-neutral-700" />
          </div>
        </div>

        {/* REVIEWS */}
        <div className="space-y-4">
          <Skeleton className="h-5 w-24" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1,2,3,4].map(i => (
              <div key={i} className="p-5 rounded-2xl border border-neutral-100 space-y-3">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-5/6" />
              </div>
            ))}
          </div>
        </div>

        {/* BOOKING */}
        <div className="bg-white border border-neutral-200 rounded-[2.5rem] p-6 md:p-10 shadow-xl grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <div className="space-y-6">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-3 w-full" />
          </div>

          <div className="bg-neutral-50 rounded-3xl p-6 space-y-4 border border-neutral-100">
            <Skeleton className="h-4 w-32 mx-auto" />
            <Skeleton className="h-10 w-40 mx-auto" />
            <Skeleton className="h-14 w-full rounded-2xl" />
          </div>
        </div>

      </div>
    </main>
  );
}