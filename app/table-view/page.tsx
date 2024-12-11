"use client";

import { useState, useEffect, useMemo } from "react";
import { getAllPurchaseRecords } from "@/lib/firebase-utils";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/vegetables/data-table";
import { PurchaseCard } from "@/components/vegetables/purchase-card";
import { dummyVegetables, dummyPurchases } from "@/lib/data";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useVegetableFilters } from "@/lib/hooks/useVegetableFilters";
import { DataFilters } from "@/components/ui/data-filters";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { groupPurchasesByDate } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { PurchaseGroup } from "@/lib/types";
import { usePurchaseFilters } from "@/lib/hooks/usePurchaseFilters";

const ITEMS_PER_PAGE = 10;

export default function TableView() {
  const [purchaseGroups, setPurchaseGroups] = useState<PurchaseGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const {
    search: purchaseSearch,
    setSearch: setPurchaseSearch,
    sortField: purchaseSortField,
    setSortField: setPurchaseSortField,
    sortOrder: purchaseSortOrder,
    setSortOrder: setPurchaseSortOrder,
    filteredAndSortedPurchases,
  } = usePurchaseFilters(purchaseGroups);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return {
      table: filteredAndSortedPurchases.slice(startIndex, endIndex),
      cards: filteredAndSortedPurchases.slice(startIndex, endIndex),
    };
  }, [filteredAndSortedPurchases, currentPage]);

  const totalPages = Math.ceil(
    filteredAndSortedPurchases.length / ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const loadPurchases = async () => {
      try {
        const data = await getAllPurchaseRecords();
        setPurchaseGroups(data);
      } catch (error) {
        console.error("Error loading purchases:", error);
      } finally {
        setLoading(false);
      }
    };

    loadPurchases();
  }, []);

  if (loading) {
    return <div>Loading records...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-6 md:py-8 lg:py-12 max-w-7xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 md:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight">
            Purchase History
          </h1>
          <Button asChild variant="outline">
            <Link href="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
        </div>

        <Card className="bg-white rounded-xl shadow-lg p-4 md:p-6 lg:p-8">
          <Tabs defaultValue="table" className="space-y-8">
            <TabsList>
              <TabsTrigger value="table">Table View</TabsTrigger>
              <TabsTrigger value="cards">Card View</TabsTrigger>
            </TabsList>

            <TabsContent value="table" className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg shadow-inner">
                <DataFilters
                  search={purchaseSearch}
                  onSearchChange={(value) => setPurchaseSearch(value)}
                  fields={[
                    { value: "date", label: "Date" },
                    { value: "vegetableName", label: "Vegetable" },
                    { value: "price", label: "Price" },
                    { value: "quantity", label: "Quantity" },
                  ]}
                />
              </div>
              <DataTable
                purchases={paginatedData.table}
                sortField={purchaseSortField}
                sortOrder={purchaseSortOrder}
                onSort={(field) => {
                  if (field === purchaseSortField) {
                    setPurchaseSortOrder(
                      purchaseSortOrder === "asc" ? "desc" : "asc"
                    );
                  } else {
                    setPurchaseSortField(field as any);
                    setPurchaseSortOrder("asc");
                  }
                }}
                currentPage={currentPage}
                onPageChange={handlePageChange}
                totalPages={totalPages}
              />
            </TabsContent>

            <TabsContent value="cards">
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                  {paginatedData.cards.map((group) => (
                    <PurchaseCard key={group.date} group={group} />
                  ))}
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
                              handlePageChange(Math.max(1, currentPage - 1));
                            }}
                            className={
                              currentPage === 1
                                ? "pointer-events-none opacity-50"
                                : ""
                            }
                          />
                        </PaginationItem>
                        {Array.from(
                          { length: totalPages },
                          (_, i) => i + 1
                        ).map((page) => (
                          <PaginationItem key={page}>
                            <PaginationLink
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                handlePageChange(page);
                              }}
                              isActive={currentPage === page}
                            >
                              {page}
                            </PaginationLink>
                          </PaginationItem>
                        ))}
                        <PaginationItem>
                          <PaginationNext
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              handlePageChange(
                                Math.min(totalPages, currentPage + 1)
                              );
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
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}
