export interface Vegetable {
  id: string;
  name: string;
  currentPrice: number;
  lastPrice: number;
  lastUpdated: string;
}

export interface PurchasePrices {
  kg: number;
  gram: number;
  originalUnit: "kg" | "gram";
  originalPrice: number;
}

export interface Purchase {
  id: string;
  vegetableId: string;
  vegetableName: string;
  quantity: number;
  unit: "kg" | "gram";
  price: number;
  date: string;
  prices: PurchasePrices;
}

export interface PurchaseGroup {
  date: string;
  purchases: (Purchase & { vegetableName: string })[];
  totalAmount: number;
}

export type SortField = "name" | "currentPrice" | "lastUpdated";
export type SortOrder = "asc" | "desc";

export interface PriceList {
  [key: string]: number;
}
