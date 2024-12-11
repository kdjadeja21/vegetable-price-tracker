"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, ArrowUpDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DataFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  sortField?: string;
  onSortFieldChange?: (value: string) => void;
  sortOrder?: "asc" | "desc";
  onSortOrderChange?: (value: string) => void;
  fields?: { value: string; label: string }[];
}

export function DataFilters({
  search,
  onSearchChange,
  sortField,
  onSortFieldChange,
  sortOrder,
  onSortOrderChange,
  fields,
}: DataFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search vegetables..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9 pr-9"
        />
        {search && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-1 top-1 h-7 w-7 p-0 hover:bg-transparent"
            onClick={() => onSearchChange("")}
          >
            <X className="h-4 w-4 text-muted-foreground" />
          </Button>
        )}
      </div>
      <div className="flex gap-2">
        <Select value={sortField} onValueChange={onSortFieldChange}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">Name</SelectItem>
            <SelectItem value="currentPrice">Current Price</SelectItem>
            <SelectItem value="lastUpdated">Last Updated</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sortOrder} onValueChange={onSortOrderChange}>
          <SelectTrigger className="w-[120px]">
            <ArrowUpDown className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Order" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="asc">Ascending</SelectItem>
            <SelectItem value="desc">Descending</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
