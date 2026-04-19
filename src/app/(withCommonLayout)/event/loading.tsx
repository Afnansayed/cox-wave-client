

import { Skeleton } from "@/components/ui/skeleton";

export default function EventPageLoading() {
  return (
    <main className="min-h-screen bg-neutral-50">
      
      {/* 🌊 HERO SECTION */}
      <section className="relative h-[420px] w-full overflow-hidden">
        <Skeleton className="absolute inset-0 w-full h-full" />

        <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 text-center space-y-6">
          
          {/* badge */}
          <Skeleton className="h-6 w-40 rounded-full" />

          {/* title */}
          <Skeleton className="h-12 w-[60%] max-w-xl" />
          <Skeleton className="h-12 w-[40%] max-w-md" />

          {/* subtitle */}
          <Skeleton className="h-4 w-[50%]" />
          <Skeleton className="h-4 w-[40%]" />

          {/* search bar */}
          <div className="w-full max-w-2xl bg-white p-2 rounded-full shadow-md flex gap-2">
            <Skeleton className="h-10 flex-1 rounded-full" />
            <Skeleton className="h-10 w-32 rounded-full" />
            <Skeleton className="h-10 w-36 rounded-full" />
          </div>
        </div>
      </section>

      {/* 🎉 EVENTS GRID */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {[1, 2, 3, 4, 5, 6].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-3xl border border-neutral-200 shadow-sm overflow-hidden"
            >
              
              {/* image */}
              <Skeleton className="h-52 w-full" />

              <div className="p-5 space-y-4">
                
                {/* location */}
                <Skeleton className="h-3 w-32" />

                {/* title */}
                <Skeleton className="h-5 w-3/4" />

                {/* host */}
                <Skeleton className="h-3 w-40" />

                {/* info row */}
                <div className="flex gap-4">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-3 w-20" />
                </div>

                {/* price + button */}
                <div className="flex items-center justify-between pt-2">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-10 w-28 rounded-full" />
                </div>
              </div>
            </div>
          ))}

        </div>
      </section>
    </main>
  );
}