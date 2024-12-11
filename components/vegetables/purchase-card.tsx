"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PurchaseGroup } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { CalendarDays } from "lucide-react";

interface PurchaseCardProps {
  group: PurchaseGroup;
}

export function PurchaseCard({ group }: PurchaseCardProps) {
  const calculateTotal = (quantity: number, unit: string, price: number) => {
    // For gram purchases, convert quantity to kg first
    const quantityInKg = unit === "gram" ? quantity / 1000 : quantity;
    return quantityInKg * price;
  };

  // Calculate group total correctly
  const groupTotal = group.purchases.reduce((total, purchase) => {
    return (
      total + calculateTotal(purchase.quantity, purchase.unit, purchase.price)
    );
  }, 0);

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2 text-muted-foreground">
          <CalendarDays className="h-4 w-4" />
          <span>{new Date(group.date).toLocaleDateString()}</span>
        </div>
        <CardTitle className="text-xl">{formatCurrency(groupTotal)}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {group.purchases.map((purchase) => (
          <div
            key={purchase.id}
            className="flex justify-between items-center p-2 rounded-md bg-muted/50"
          >
            <span className="font-medium">{purchase.vegetableName}</span>
            <div className="text-right">
              <div>
                {purchase.quantity} {purchase.unit} ×{" "}
                {formatCurrency(purchase.price)}
                <span className="text-sm text-muted-foreground">
                  ({formatCurrency(purchase.prices.kg)}/kg)
                </span>
              </div>
              <div className="text-sm text-muted-foreground">
                ={" "}
                {formatCurrency(
                  calculateTotal(
                    purchase.quantity,
                    purchase.unit,
                    purchase.prices.kg
                  )
                )}
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
