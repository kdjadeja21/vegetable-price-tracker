"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PurchaseGroup, Purchase } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationLink,
} from "@/components/ui/pagination";

interface DataTableProps {
  purchases: PurchaseGroup[];
  sortField: string;
  sortOrder: "asc" | "desc";
  onSort: (field: string) => void;
  currentPage: number;
  onPageChange: (page: number) => void;
  totalPages: number;
}

export function DataTable({
  purchases,
  sortField,
  sortOrder,
  onSort,
  currentPage,
  onPageChange,
  totalPages,
}: DataTableProps) {
  const calculateTotal = (purchase: Purchase) => {
    if (purchase.unit === "gram") {
      // Convert gram price to kg price for calculation
      return (purchase.quantity / 1000) * purchase.price;
    }
    return purchase.quantity * purchase.price;
  };

  const SortIcon = ({ field }: { field: string }) => {
    if (field !== sortField) return <ArrowUpDown className="w-4 h-4 ml-1" />;
    return sortOrder === "asc" ? (
      <ArrowUp className="w-4 h-4 ml-1" />
    ) : (
      <ArrowDown className="w-4 h-4 ml-1" />
    );
  };

  const SortableHeader = ({
    field,
    children,
  }: {
    field: string;
    children: React.ReactNode;
  }) => (
    <TableHead>
      <Button
        variant="ghost"
        className="hover:bg-transparent flex items-center font-medium"
        onClick={() => onSort(field)}
      >
        {children}
        <SortIcon field={field} />
      </Button>
    </TableHead>
  );

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <SortableHeader field="vegetableName">Vegetable</SortableHeader>
              <SortableHeader field="quantity">Quantity</SortableHeader>
              <SortableHeader field="price">Price/kg</SortableHeader>
              <TableHead>Price/100g</TableHead>
              <TableHead>Price/250g</TableHead>
              <TableHead>Price/500g</TableHead>
              <SortableHeader field="date">Date</SortableHeader>
            </TableRow>
          </TableHeader>
          <TableBody>
            {purchases.map((group) => (
              <>
                {group.purchases.map((purchase) => (
                  <TableRow key={purchase.id}>
                    <TableCell className="font-medium">
                      {purchase.vegetableName}
                    </TableCell>
                    <TableCell>
                      {purchase.quantity} {purchase.unit}
                    </TableCell>
                    <TableCell>{formatCurrency(purchase.prices.kg)}</TableCell>
                    <TableCell>
                      {formatCurrency(purchase.prices.kg * 0.1)}
                    </TableCell>
                    <TableCell>
                      {formatCurrency(purchase.prices.kg * 0.25)}
                    </TableCell>
                    <TableCell>
                      {formatCurrency(purchase.prices.kg * 0.5)}
                    </TableCell>
                    <TableCell>
                      {new Date(group.date).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </>
            ))}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    onPageChange(Math.max(1, currentPage - 1));
                  }}
                  className={
                    currentPage === 1 ? "pointer-events-none opacity-50" : ""
                  }
                />
              </PaginationItem>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        onPageChange(page);
                      }}
                      isActive={currentPage === page}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                )
              )}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    onPageChange(Math.min(totalPages, currentPage + 1));
                  }}
                  className={
                    currentPage === totalPages
                      ? "pointer-events-none opacity-50"
                      : ""
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
