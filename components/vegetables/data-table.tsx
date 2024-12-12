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
import { ArrowDown, ArrowUp, ArrowUpDown, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationLink,
} from "@/components/ui/pagination";
import { PaginationWithSize } from "@/components/ui/pagination-with-size";

interface DataTableProps {
  purchases: PurchaseGroup[];
  currentPage: number;
  onPageChange: (page: number) => void;
  totalPages: number;
  onEdit: (purchase: Purchase) => void;
  onDelete: (purchaseId: string) => void;
  pageSize: number;
  onPageSizeChange: (size: number) => void;
}

export function DataTable({
  purchases,
  currentPage,
  onPageChange,
  totalPages,
  onEdit,
  onDelete,
  pageSize,
  onPageSizeChange,
}: DataTableProps) {
  const calculateTotal = (purchase: Purchase) => {
    if (purchase.unit === "gram") {
      // Convert gram price to kg price for calculation
      return (purchase.quantity / 1000) * purchase.price;
    }
    return purchase.quantity * purchase.price;
  };

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Vegetable</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Price/kg</TableHead>
              <TableHead>Price/100g</TableHead>
              <TableHead>Price/250g</TableHead>
              <TableHead>Price/500g</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
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
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEdit(purchase)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          onClick={() => onDelete(purchase.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-center mt-6">
        <PaginationWithSize
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
        />
      </div>
    </div>
  );
}
