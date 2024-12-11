import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  where,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "./firebase";
import { Purchase } from "./types";
import { groupPurchasesByDate } from "./utils";

// Purchases Collection
export async function addPurchase(purchase: Omit<Purchase, "id">) {
  try {
    // Calculate prices for all units
    const pricePerKg =
      purchase.unit === "gram"
        ? (purchase.price / purchase.quantity) * 1000
        : purchase.price;

    const priceInAllUnits = {
      kg: pricePerKg,
      gram: pricePerKg / 1000,
      originalUnit: purchase.unit,
      originalPrice: purchase.price,
    };

    const docRef = await addDoc(collection(db, "purchases"), {
      ...purchase,
      prices: priceInAllUnits,
    });

    return { id: docRef.id, ...purchase };
  } catch (error) {
    console.error("Error adding purchase:", error);
    throw error;
  }
}

export async function getPurchases() {
  try {
    const querySnapshot = await getDocs(
      query(collection(db, "purchases"), orderBy("date", "desc"))
    );
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Purchase[];
  } catch (error) {
    console.error("Error getting purchases:", error);
    throw error;
  }
}

export async function getPurchasesByDateRange(
  startDate: string,
  endDate: string
) {
  try {
    const querySnapshot = await getDocs(
      query(
        collection(db, "purchases"),
        where("date", ">=", startDate),
        where("date", "<=", endDate),
        orderBy("date", "desc")
      )
    );
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Purchase[];
  } catch (error) {
    console.error("Error getting purchases by date range:", error);
    throw error;
  }
}

export async function getVegetables() {
  try {
    const querySnapshot = await getDocs(
      query(collection(db, "purchases"), orderBy("date", "desc"))
    );

    const purchases = querySnapshot.docs.map((doc) => doc.data());
    const vegetablesMap = new Map();

    purchases.forEach((purchase) => {
      const vegetableKey = purchase.vegetableName.toLowerCase();

      if (!vegetablesMap.has(vegetableKey)) {
        vegetablesMap.set(vegetableKey, {
          id: purchase.vegetableId,
          name: purchase.vegetableName,
          currentPrice: purchase.prices.kg,
          lastPrice: purchase.prices.kg,
          lastUpdated: purchase.date,
        });
      } else {
        const existingVeg = vegetablesMap.get(vegetableKey);
        if (existingVeg.lastUpdated === existingVeg.lastUpdated) {
          vegetablesMap.set(vegetableKey, {
            ...existingVeg,
            lastPrice: purchase.prices.kg,
          });
        }
      }
    });

    return Array.from(vegetablesMap.values());
  } catch (error) {
    console.error("Error getting vegetables:", error);
    throw error;
  }
}

export async function getAllPurchaseRecords() {
  try {
    const querySnapshot = await getDocs(
      query(collection(db, "purchases"), orderBy("date", "desc"))
    );

    const purchases = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Purchase[];

    return groupPurchasesByDate(purchases);
  } catch (error) {
    console.error("Error getting purchase records:", error);
    throw error;
  }
}
