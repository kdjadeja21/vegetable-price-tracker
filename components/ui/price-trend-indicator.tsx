"use client";

import { ArrowUp, ArrowDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface PriceTrendIndicatorProps {
  currentPrice: number;
  lastPrice: number;
  className?: string;
}

export function PriceTrendIndicator({
  currentPrice,
  lastPrice,
  className,
}: PriceTrendIndicatorProps) {
  const priceDifference = currentPrice - lastPrice;
  const percentageChange = ((priceDifference) / lastPrice) * 100;

  if (priceDifference > 0) {
    return (
      <div className={cn("flex items-center text-red-500", className)}>
        <ArrowUp className="w-4 h-4 mr-1" />
        <span>+{percentageChange.toFixed(1)}%</span>
      </div>
    );
  } else if (priceDifference < 0) {
    return (
      <div className={cn("flex items-center text-green-500", className)}>
        <ArrowDown className="w-4 h-4 mr-1" />
        <span>{percentageChange.toFixed(1)}%</span>
      </div>
    );
  }

  return (
    <div className={cn("flex items-center text-gray-500", className)}>
      <Minus className="w-4 h-4 mr-1" />
      <span>0%</span>
    </div>
  );
}