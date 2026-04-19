import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const Pagination = ({
  currentPage,
  totalPages,
  isLoading,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  isLoading: boolean;
  onPageChange: (page: number) => void;
}) => {
  if (totalPages <= 1) {
    return null;
  }

  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
<div className="flex flex-wrap items-center justify-center gap-3 pt-8">
  {/* PREVIOUS BUTTON */}
  <Button
    type="button"
    variant="ghost"
    onClick={() => onPageChange(currentPage - 1)}
    disabled={isLoading || currentPage <= 1}
    className="rounded-full px-5 text-[10px] font-black uppercase tracking-widest text-neutral-500 hover:bg-neutral-100 disabled:opacity-30"
  >
    <ChevronLeft size={14} className="mr-1" />
    Prev
  </Button>

  {/* PAGE NUMBERS */}
  <div className="flex items-center gap-1.5 px-2 py-1.5 bg-neutral-50 rounded-full border border-neutral-100">
    {pageNumbers.map((page) => (
      <Button
        key={page}
        type="button"
        variant={page === currentPage ? "default" : "ghost"}
        onClick={() => onPageChange(page)}
        disabled={isLoading}
        className={cn(
          "h-9 w-9 rounded-full text-xs font-black transition-all duration-300",
          page === currentPage 
            ? "bg-primary text-white shadow-lg scale-110" 
            : "text-neutral-500 hover:bg-white hover:text-primary hover:shadow-sm"
        )}
      >
        {page}
      </Button>
    ))}
  </div>

  {/* NEXT BUTTON */}
  <Button
    type="button"
    variant="ghost"
    onClick={() => onPageChange(currentPage + 1)}
    disabled={isLoading || currentPage >= totalPages}
    className="rounded-full px-5 text-[10px] font-black uppercase tracking-widest text-neutral-500 hover:bg-neutral-100 disabled:opacity-30"
  >
    Next
    <ChevronRight size={14} className="ml-1" />
  </Button>
</div>
  );
};