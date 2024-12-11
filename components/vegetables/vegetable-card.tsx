"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Vegetable } from "@/lib/types";
import { calculatePrice, formatCurrency } from "@/lib/utils";
import { ArrowDown, ArrowUp, Minus } from "lucide-react";

interface VegetableCardProps {
  vegetable: Vegetable;
}

export function VegetableCard({ vegetable }: VegetableCardProps) {
  const priceChange = vegetable.currentPrice - vegetable.lastPrice;
  const priceList = calculatePrice("KG", vegetable.currentPrice);

  return (
    <Card className="transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-bold">{vegetable.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="text-2xl font-bold">
              {formatCurrency(vegetable.currentPrice)}
              <span className="text-sm text-muted-foreground">/kg</span>
            </div>
            <PriceChangeIndicator change={priceChange} />
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">
              Price List
            </h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {Object.entries(priceList).map(([unit, price]) => (
                <div
                  key={unit}
                  className="flex justify-between p-2 rounded-md bg-muted/50 transition-colors duration-200 hover:bg-muted"
                >
                  <span>{unit}</span>
                  <span className="font-medium">{formatCurrency(price)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="text-xs text-muted-foreground">
            Last updated: {new Date(vegetable.lastUpdated).toLocaleDateString()}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function PriceChangeIndicator({ change }: { change: number }) {
  if (change === 0) {
    return (
      <div className="flex items-center text-muted-foreground">
        <Minus className="w-4 h-4" />
        <span className="ml-1 text-sm">No change</span>
      </div>
    );
  }

  const Icon = change > 0 ? ArrowUp : ArrowDown;
  const textColor = change > 0 ? "text-red-500" : "text-green-500";

  return (
    <div className={`flex items-center ${textColor}`}>
      <Icon className="w-4 h-4" />
      <span className="ml-1 text-sm">{formatCurrency(Math.abs(change))}</span>
    </div>
  );
}
