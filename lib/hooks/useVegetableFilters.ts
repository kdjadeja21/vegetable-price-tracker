"use client";

import { useState, useEffect } from "react";
import { Vegetable, SortField, SortOrder } from "@/lib/types";
import { getVegetables } from "@/lib/firebase-utils";

export function useVegetableFilters() {
  const [vegetables, setVegetables] = useState<Vegetable[]>([]);
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadVegetables = async () => {
      try {
        const data = await getVegetables();
        setVegetables(data);
      } catch (error) {
        console.error("Error loading vegetables:", error);
      } finally {
        setLoading(false);
      }
    };

    loadVegetables();
  }, []);

  let filteredAndSortedVegetables = [...vegetables];

  // Apply search filter
  if (search) {
    filteredAndSortedVegetables = filteredAndSortedVegetables.filter(
      (vegetable) => vegetable.name.toLowerCase().includes(search.toLowerCase())
    );
  }

  // Apply sorting
  filteredAndSortedVegetables.sort((a, b) => {
    let aValue: string | number;
    let bValue: string | number;

    switch (sortField) {
      case "name":
        aValue = a.name;
        bValue = b.name;
        // For names, ascending is A-Z, descending is Z-A
        return sortOrder === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      case "currentPrice":
        aValue = a.currentPrice;
        bValue = b.currentPrice;
        // For prices, ascending is lowest first, descending is highest first
        return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
      case "lastUpdated":
        aValue = new Date(a.lastUpdated).getTime();
        bValue = new Date(b.lastUpdated).getTime();
        // For dates, ascending is oldest first, descending is newest first
        return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
      default:
        return 0;
    }
  });

  return {
    loading,
    search,
    setSearch,
    sortField,
    setSortField,
    sortOrder,
    setSortOrder,
    filteredAndSortedVegetables,
  };
}
