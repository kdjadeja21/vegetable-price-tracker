import { useState, useMemo } from "react";
import { PurchaseGroup } from "@/lib/types";

type PurchaseSortField = "date" | "vegetableName" | "price" | "quantity";
type SortOrder = "asc" | "desc";

export function usePurchaseFilters(purchaseGroups: PurchaseGroup[]) {
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<PurchaseSortField>("date");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  const filteredAndSortedPurchases = useMemo(() => {
    let result = [...purchaseGroups];

    // Filter by search term
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

    // Sort purchases within each group
    result = result.map((group) => ({
      ...group,
      purchases: [...group.purchases].sort((a, b) => {
        switch (sortField) {
          case "vegetableName":
            return sortOrder === "asc"
              ? a.vegetableName.localeCompare(b.vegetableName)
              : b.vegetableName.localeCompare(a.vegetableName);
          case "price":
            return sortOrder === "asc"
              ? a.prices.kg - b.prices.kg
              : b.prices.kg - a.prices.kg;
          case "quantity":
            const qtyA = a.unit === "gram" ? a.quantity / 1000 : a.quantity;
            const qtyB = b.unit === "gram" ? b.quantity / 1000 : b.quantity;
            return sortOrder === "asc" ? qtyA - qtyB : qtyB - qtyA;
          default:
            return 0;
        }
      }),
    }));

    // Sort groups by date
    if (sortField === "date") {
      result.sort((a, b) => {
        return sortOrder === "asc"
          ? new Date(a.date).getTime() - new Date(b.date).getTime()
          : new Date(b.date).getTime() - new Date(a.date).getTime();
      });
    }

    return result;
  }, [purchaseGroups, search, sortField, sortOrder]);

  return {
    search,
    setSearch,
    sortField,
    setSortField,
    sortOrder,
    setSortOrder,
    filteredAndSortedPurchases,
  };
}
