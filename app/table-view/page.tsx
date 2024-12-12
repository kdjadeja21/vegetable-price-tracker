"use client";

import { useState, useEffect, useMemo } from "react";
import { getAllPurchaseRecords, deletePurchase } from "@/lib/firebase-utils";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/vegetables/data-table";
import { PurchaseCard } from "@/components/vegetables/purchase-card";
import { dummyVegetables, dummyPurchases } from "@/lib/data";
import Link from "next/link";
import { ArrowLeft, Plus } from "lucide-react";
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
import { PurchaseGroup, Purchase } from "@/lib/types";
import { usePurchaseFilters } from "@/lib/hooks/usePurchaseFilters";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { PaginationWithSize } from "@/components/ui/pagination-with-size";

const ITEMS_PER_PAGE = 5;

export default function TableView() {
  const [purchaseGroups, setPurchaseGroups] = useState<PurchaseGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [purchaseToDelete, setPurchaseToDelete] = useState<string | null>(null);
  const { toast } = useToast();
  const router = useRouter();
  const [pageSize, setPageSize] = useState(5);

  const filteredPurchases = useMemo(() => {
    let result = [...purchaseGroups];

    if (search) {
      result = result
        .map((group) => ({
          ...group,
          purchases: group.purchases.filter((purchase) =>
            purchase.vegetableName.toLowerCase().includes(search.toLowerCase())
          ),
        }))
        .filter((group) => group.purchases.length > 0);
    }

    return result;
  }, [purchaseGroups, search]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    // Flatten all purchases first
    const flattenedPurchases = filteredPurchases.flatMap((group) =>
      group.purchases.map((purchase) => ({
        ...purchase,
        date: group.date,
      }))
    );

    // Slice the flattened purchases
    const paginatedPurchases = flattenedPurchases.slice(startIndex, endIndex);

    // Regroup the paginated purchases
    const groupedPurchases = paginatedPurchases.reduce((groups, purchase) => {
      const date = purchase.date;
      const existingGroup = groups.find((g) => g.date === date);

      if (existingGroup) {
        existingGroup.purchases.push(purchase);
      } else {
        groups.push({
          date,
          purchases: [purchase],
          totalAmount: 0,
        });
      }

      return groups;
    }, [] as PurchaseGroup[]);

    return {
      table: groupedPurchases,
      cards: groupedPurchases,
      totalItems: flattenedPurchases.length,
    };
  }, [filteredPurchases, currentPage, pageSize]);

  const totalPages = Math.ceil(paginatedData.totalItems / pageSize);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  const handleEdit = (purchase: Purchase) => {
    router.push(`/add-purchase?edit=${purchase.id}`);
  };

  const handleDelete = async () => {
    if (!purchaseToDelete) return;

    try {
      await deletePurchase(purchaseToDelete);
      const updatedData = await getAllPurchaseRecords();
      setPurchaseGroups(updatedData);
      toast({
        title: "Purchase deleted",
        description: "The purchase has been successfully deleted.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete the purchase. Please try again.",
        variant: "destructive",
      });
    } finally {
      setPurchaseToDelete(null);
    }
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
    <>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
        <div className="container mx-auto px-4 py-6 md:py-8 lg:py-12 max-w-7xl">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 md:mb-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight">
              Purchase History
            </h1>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <Button asChild className="w-full sm:w-auto">
                <Link href="/add-purchase">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Purchase
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full sm:w-auto">
                <Link href="/">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Link>
              </Button>
            </div>
          </div>

          <Card className="bg-white rounded-xl shadow-lg p-4 md:p-6 lg:p-8">
            <Tabs defaultValue="table" className="space-y-8">
              <TabsList>
                <TabsTrigger value="table">Table View</TabsTrigger>
                <TabsTrigger value="cards">Card View</TabsTrigger>
              </TabsList>

              <div className="bg-gray-50 p-4 rounded-lg shadow-inner">
                <DataFilters search={search} onSearchChange={setSearch} />
              </div>

              <TabsContent value="table" className="space-y-6">
                <DataTable
                  purchases={paginatedData.table}
                  currentPage={currentPage}
                  onPageChange={handlePageChange}
                  totalPages={totalPages}
                  onEdit={handleEdit}
                  onDelete={(id) => setPurchaseToDelete(id)}
                  pageSize={pageSize}
                  onPageSizeChange={handlePageSizeChange}
                />
              </TabsContent>

              <TabsContent value="cards">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                    {filteredPurchases.map((group) => (
                      <PurchaseCard key={group.date} group={group} />
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </div>

      <AlertDialog
        open={!!purchaseToDelete}
        onOpenChange={() => setPurchaseToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              purchase record.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
