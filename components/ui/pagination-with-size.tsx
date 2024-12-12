import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";

interface PaginationWithSizeProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

export function PaginationWithSize({
  currentPage,
  totalPages,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: PaginationWithSizeProps) {
  const renderPageNumbers = () => {
    const pages = [];

    if (totalPages <= 4) {
      // Show all pages if total is 4 or less
      for (let i = 1; i <= totalPages; i++) {
        pages.push(
          <PaginationItem key={i} className="hidden sm:inline-flex">
            <PaginationLink
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onPageChange(i);
              }}
              className={cn(
                "min-w-[32px] sm:min-w-[40px] h-8 sm:h-10 text-center transition-colors text-sm sm:text-base",
                currentPage === i
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "hover:bg-muted"
              )}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      // Always show first page
      pages.push(
        <PaginationItem key={1} className="hidden sm:inline-flex">
          <PaginationLink
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onPageChange(1);
            }}
            className={cn(
              "min-w-[32px] sm:min-w-[40px] h-8 sm:h-10 text-center transition-colors text-sm sm:text-base",
              currentPage === 1
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : "hover:bg-muted"
            )}
          >
            1
          </PaginationLink>
        </PaginationItem>
      );

      // Show ellipsis if needed
      if (currentPage > 3) {
        pages.push(
          <PaginationItem
            key="ellipsis-start"
            className="hidden sm:inline-flex"
          >
            <span className="flex items-center justify-center w-8 sm:w-10">
              ...
            </span>
          </PaginationItem>
        );
      }

      // Show current pages
      for (
        let i = Math.max(2, currentPage - 1);
        i <= Math.min(totalPages - 1, currentPage + 1);
        i++
      ) {
        pages.push(
          <PaginationItem key={i} className="hidden sm:inline-flex">
            <PaginationLink
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onPageChange(i);
              }}
              className={cn(
                "min-w-[32px] sm:min-w-[40px] h-8 sm:h-10 text-center transition-colors text-sm sm:text-base",
                currentPage === i
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "hover:bg-muted"
              )}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }

      // Show ellipsis if needed
      if (currentPage < totalPages - 2) {
        pages.push(
          <PaginationItem key="ellipsis-end" className="hidden sm:inline-flex">
            <span className="flex items-center justify-center w-8 sm:w-10">
              ...
            </span>
          </PaginationItem>
        );
      }

      // Always show last page
      pages.push(
        <PaginationItem key={totalPages} className="hidden sm:inline-flex">
          <PaginationLink
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onPageChange(totalPages);
            }}
            className={cn(
              "min-w-[32px] sm:min-w-[40px] h-8 sm:h-10 text-center transition-colors text-sm sm:text-base",
              currentPage === totalPages
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : "hover:bg-muted"
            )}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    // Add mobile current page indicator
    pages.push(
      <PaginationItem key="mobile-indicator" className="sm:hidden">
        <span className="text-sm">
          Page {currentPage} of {totalPages}
        </span>
      </PaginationItem>
    );

    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Per page:</span>
        <Select
          value={pageSize.toString()}
          onValueChange={(value) => onPageSizeChange(Number(value))}
        >
          <SelectTrigger className="w-[70px] sm:w-[70px]">
            <SelectValue placeholder="Select size" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="5">5</SelectItem>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="20">20</SelectItem>
            <SelectItem value="50">50</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {totalPages > 1 && (
        <Pagination>
          <PaginationContent className="flex items-center gap-1 sm:gap-2">
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  onPageChange(Math.max(1, currentPage - 1));
                }}
                className={cn(
                  "h-8 sm:h-10 min-w-[32px] sm:min-w-[40px] p-0 sm:px-2.5",
                  currentPage === 1 ? "pointer-events-none opacity-50" : ""
                )}
              />
            </PaginationItem>
            {renderPageNumbers()}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  onPageChange(Math.min(totalPages, currentPage + 1));
                }}
                className={cn(
                  "h-8 sm:h-10 min-w-[32px] sm:min-w-[40px] p-0 sm:px-2.5",
                  currentPage === totalPages
                    ? "pointer-events-none opacity-50"
                    : ""
                )}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
