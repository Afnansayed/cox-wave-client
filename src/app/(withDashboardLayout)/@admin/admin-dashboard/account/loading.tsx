import { Skeleton } from "@/components/ui/skeleton";

function AdminProfileLoading() {
  return (
    <div className="w-full mx-auto py-6 px-4 md:py-10 md:px-6 animate-pulse">
      
      {/* Header Skeleton */}
      <div className="relative mb-6 md:mb-8">
        {/* Backdrop */}
        <div className="h-24 w-full bg-slate-100 rounded-t-[1.5rem] md:rounded-t-[2rem]" />
        
        <div className="bg-white rounded-b-[1.5rem] md:rounded-b-[2rem] border border-slate-100 px-4 pb-6 md:px-8 shadow-sm border-t-0">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-4 md:gap-6 -mt-12">
            
            {/* Avatar Skeleton */}
            <div className="relative">
              <Skeleton className="h-24 w-24 md:h-28 md:w-28 rounded-[2rem] border-4 border-white bg-slate-200 shadow-md" />
            </div>
            
            {/* Info Skeleton */}
            <div className="flex-1 space-y-3 mb-2 w-full flex flex-col items-center md:items-start">
              <div className="flex items-center gap-3">
                <Skeleton className="h-7 w-48 bg-slate-200 rounded-lg" />
                <Skeleton className="h-5 w-16 bg-slate-100 rounded-full" />
              </div>
              <Skeleton className="h-4 w-32 bg-slate-100 rounded-md" />
            </div>

            {/* Button Skeleton */}
            <Skeleton className="w-full md:w-32 h-10 rounded-xl bg-slate-200 mb-2" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
        
        {/* Main Details Skeleton */}
        <div className="lg:col-span-7 space-y-6 order-2 lg:order-1">
          <div className="bg-white rounded-[1.5rem] md:rounded-[2rem] border border-slate-100 p-5 md:p-8 shadow-sm space-y-8">
            <Skeleton className="h-4 w-32 bg-slate-200 rounded-md" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="h-3 w-20 bg-slate-100 rounded" />
                  <Skeleton className="h-12 w-full bg-slate-50/50 rounded-xl border border-slate-100" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Skeleton */}
        <div className="lg:col-span-5 space-y-6 order-1 lg:order-2">
          <div className="bg-slate-900/5 rounded-[1.5rem] md:rounded-[2rem] p-6 md:p-8 space-y-6 border border-slate-100">
            <Skeleton className="h-3 w-24 bg-slate-200 rounded" />
            
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-slate-100">
                  <Skeleton className="h-10 w-10 rounded-xl bg-slate-200 shrink-0" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-2 w-16 bg-slate-100" />
                    <Skeleton className="h-4 w-24 bg-slate-200" />
                  </div>
                </div>
              ))}
              
              <div className="pt-2 space-y-3">
                <Skeleton className="h-2 w-28 bg-slate-100 mx-1" />
                <Skeleton className="h-16 w-full bg-slate-50 rounded-xl border border-slate-100" />
              </div>
            </div>
          </div>

          {/* Security Note Skeleton */}
          <div className="bg-rose-50/50 rounded-[1.5rem] p-5 border border-rose-100/50 flex items-start gap-4">
            <Skeleton className="h-8 w-8 rounded-lg bg-rose-100/50 shrink-0" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-3 w-24 bg-rose-100/50" />
              <Skeleton className="h-2 w-full bg-rose-100/30" />
              <Skeleton className="h-2 w-4/5 bg-rose-100/30" />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default AdminProfileLoading;