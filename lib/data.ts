import { Vegetable, Purchase } from "./types";

export const dummyVegetables: Vegetable[] = [
  {
    id: "1",
    name: "Tomatoes",
    currentPrice: 40,
    lastPrice: 35,
    lastUpdated: "2024-03-20",
  },
  {
    id: "2",
    name: "Potatoes",
    currentPrice: 25,
    lastPrice: 30,
    lastUpdated: "2024-03-20",
  },
  {
    id: "3",
    name: "Carrots",
    currentPrice: 35,
    lastPrice: 35,
    lastUpdated: "2024-03-20",
  },
  {
    id: "4",
    name: "Onions",
    currentPrice: 28,
    lastPrice: 25,
    lastUpdated: "2024-03-20",
  },
  {
    id: "5",
    name: "Bell Peppers",
    currentPrice: 80,
    lastPrice: 90,
    lastUpdated: "2024-03-20",
  },
  {
    id: "6",
    name: "Cucumbers",
    currentPrice: 30,
    lastPrice: 35,
    lastUpdated: "2024-03-20",
  },
  {
    id: "7",
    name: "Spinach",
    currentPrice: 45,
    lastPrice: 40,
    lastUpdated: "2024-03-19",
  },
  {
    id: "8",
    name: "Broccoli",
    currentPrice: 120,
    lastPrice: 130,
    lastUpdated: "2024-03-19",
  },
  {
    id: "9",
    name: "Cauliflower",
    currentPrice: 60,
    lastPrice: 55,
    lastUpdated: "2024-03-19",
  },
];

export const dummyPurchases: Purchase[] = [
  // March 20 purchases
  {
    id: "1",
    vegetableId: "1",
    vegetableName: "Tomatoes",
    price: 40,
    quantity: 3,
    unit: "kg",
    date: "2024-03-20",
    prices: {
      kg: 40,
      gram: 0.04,
      originalUnit: "kg",
      originalPrice: 40,
    },
  },
  {
    id: "2",
    vegetableId: "2",
    vegetableName: "Potatoes",
    price: 25,
    quantity: 5,
    unit: "kg",
    date: "2024-03-20",
    prices: {
      kg: 25,
      gram: 0.025,
      originalUnit: "kg",
      originalPrice: 25,
    },
  },
  // March 15 purchases with gram units
  {
    id: "3",
    vegetableId: "5",
    vegetableName: "Bell Peppers",
    price: 85,
    quantity: 250,
    unit: "gram",
    date: "2024-03-15",
    prices: {
      kg: 85,
      gram: 0.085,
      originalUnit: "gram",
      originalPrice: 85,
    },
  },
  {
    id: "4",
    vegetableId: "8",
    vegetableName: "Broccoli",
    price: 125,
    quantity: 500,
    unit: "gram",
    date: "2024-03-15",
    prices: {
      kg: 125,
      gram: 0.125,
      originalUnit: "gram",
      originalPrice: 125,
    },
  },
  // March 10 mixed units
  {
    id: "5",
    vegetableId: "3",
    vegetableName: "Carrots",
    price: 32,
    quantity: 750,
    unit: "gram",
    date: "2024-03-10",
    prices: {
      kg: 32,
      gram: 0.032,
      originalUnit: "gram",
      originalPrice: 32,
    },
  },
  {
    id: "6",
    vegetableId: "7",
    vegetableName: "Spinach",
    price: 42,
    quantity: 1.5,
    unit: "kg",
    date: "2024-03-10",
    prices: {
      kg: 42,
      gram: 0.042,
      originalUnit: "kg",
      originalPrice: 42,
    },
  },
  // March 5 purchases
  {
    id: "7",
    vegetableId: "4",
    vegetableName: "Onions",
    price: 26,
    quantity: 100,
    unit: "gram",
    date: "2024-03-05",
    prices: {
      kg: 26,
      gram: 0.026,
      originalUnit: "gram",
      originalPrice: 26,
    },
  },
  {
    id: "8",
    vegetableId: "9",
    vegetableName: "Cauliflower",
    price: 58,
    quantity: 2,
    unit: "kg",
    date: "2024-03-05",
    prices: {
      kg: 58,
      gram: 0.058,
      originalUnit: "kg",
      originalPrice: 58,
    },
  },
];
