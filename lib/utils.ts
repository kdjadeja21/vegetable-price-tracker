import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Purchase, PurchaseGroup, PriceList } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function groupPurchasesByDate(purchases: Purchase[]): PurchaseGroup[] {
  const groups = purchases.reduce((acc, purchase) => {
    const date = purchase.date;
    if (!acc[date]) {
      acc[date] = {
        date,
        purchases: [],
        totalAmount: 0,
      };
    }
    acc[date].purchases.push(purchase);
    const quantityInKg =
      purchase.unit === "gram" ? purchase.quantity / 1000 : purchase.quantity;
    acc[date].totalAmount += quantityInKg * purchase.price;
    return acc;
  }, {} as Record<string, Omit<PurchaseGroup, "purchases"> & { purchases: Purchase[] }>);

  return Object.values(groups).sort((a, b) => b.date.localeCompare(a.date));
}

export function calculatePrice(unit: number | "KG", price: number): PriceList {
  // Convert the input unit to grams if it's in kilograms (1 KG = 1000 grams)
  const unitInGrams = unit === "KG" ? 1000 : unit;

  // Calculate the price per gram
  const pricePerGram = price / unitInGrams;

  // Create a result object with the prices for various units
  const priceList: PriceList = {
    "100gram": pricePerGram * 100,
    "250gram": pricePerGram * 250,
    "500gram": pricePerGram * 500,
    "1KG": pricePerGram * 1000,
  };

  return priceList;
}
