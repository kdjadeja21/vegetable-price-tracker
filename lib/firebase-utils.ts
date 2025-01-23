import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  where,
  doc,
  updateDoc,
  deleteDoc,
  getDoc,
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
      // Convert vegetable name to lowercase to ensure consistent keys
      const vegetableKey = purchase.vegetableName.toLowerCase();

      // If this vegetable hasn't been seen before
      if (!vegetablesMap.has(vegetableKey)) {
        // Add it as a new entry with current price equal to last price
        vegetablesMap.set(vegetableKey, {
          id: purchase.vegetableId,
          name: purchase.vegetableName,
          currentPrice: purchase.prices.kg,  // Most recent price
          lastPrice: purchase.prices.kg,     // Same as current price initially
          lastUpdated: purchase.date,        // When this price was recorded
        });
      } else {
        // If we've seen this vegetable before
        const existingVeg = vegetablesMap.get(vegetableKey);
        const purchaseDate = new Date(purchase.date);
        const existingDate = new Date(existingVeg.lastUpdated);

        if (purchaseDate > existingDate) {
          // This is a more recent purchase, so update current price and make the existing current price the last price
          vegetablesMap.set(vegetableKey, {
            ...existingVeg,
            currentPrice: purchase.prices.kg,
            lastPrice: existingVeg.currentPrice,
            lastUpdated: purchase.date
          });
        } else if (purchaseDate < existingDate) {
          // This is an older purchase, so we only update lastPrice if it's the next most recent
          const nextMostRecentDate = purchases
            .filter(p => p.vegetableName.toLowerCase() === vegetableKey)
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[1]?.date;
            
          if (purchase.date === nextMostRecentDate) {
            vegetablesMap.set(vegetableKey, {
              ...existingVeg,
              lastPrice: purchase.prices.kg
            });
          }
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

export async function deletePurchase(purchaseId: string) {
  try {
    await deleteDoc(doc(db, "purchases", purchaseId));
  } catch (error) {
    console.error("Error deleting purchase:", error);
    throw error;
  }
}

export async function getPurchase(id: string) {
  try {
    const docRef = doc(db, "purchases", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Purchase;
    }
    return null;
  } catch (error) {
    console.error("Error getting purchase:", error);
    throw error;
  }
}

export async function updatePurchase(
  id: string,
  purchase: Omit<Purchase, "id">
) {
  try {
    await updateDoc(doc(db, "purchases", id), purchase);
  } catch (error) {
    console.error("Error updating purchase:", error);
    throw error;
  }
}
