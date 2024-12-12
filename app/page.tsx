"use client";

import { useEffect, useState } from "react";
import { getVegetables } from "@/lib/firebase-utils";
import { Vegetable } from "@/lib/types";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, Table } from "lucide-react";
import { useVegetableFilters } from "@/lib/hooks/useVegetableFilters";
import { DataFilters } from "@/components/ui/data-filters";
import { VegetableCard } from "@/components/vegetables/vegetable-card";
import { SortField, SortOrder } from "@/lib/types";
import { Loading } from "@/components/ui/loading";

export default function Home() {
  const {
    loading,
    search,
    setSearch,
    sortField,
    setSortField,
    sortOrder,
    setSortOrder,
    filteredAndSortedVegetables,
  } = useVegetableFilters();

  if (loading) {
    return <Loading message="Loading vegetables..." />;
  }

  return (
    <div className="w-full h-screen overflow-y-auto px-4 py-4 md:px-6 md:py-8">
      <div className="flex flex-col gap-4 mb-6 md:mb-8 w-full">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 w-full">
          <h1 className="text-2xl md:text-3xl font-bold">
            Vegetable Price Tracker
          </h1>
          <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
            <Button asChild variant="outline" className="w-full md:w-auto">
              <Link href="/table-view">
                <Table className="w-4 h-4 mr-2" />
                Table View
              </Link>
            </Button>
            <Button asChild className="w-full md:w-auto">
              <Link href="/add-purchase">
                <Plus className="w-4 h-4 mr-2" />
                Add Purchase
              </Link>
            </Button>
          </div>
        </div>

        <DataFilters
          search={search}
          onSearchChange={(value: string) => setSearch(value)}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 md:gap-6 w-full">
          {filteredAndSortedVegetables.map((vegetable) => (
            <VegetableCard key={vegetable.id} vegetable={vegetable} />
          ))}
        </div>
      </div>
    </div>
  );
}
