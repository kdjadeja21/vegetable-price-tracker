import { Loader2 } from "lucide-react";

interface LoadingProps {
  message?: string;
  className?: string;
}

export function Loading({
  message = "Loading...",
  className = "",
}: LoadingProps) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div
        className={`flex flex-col items-center justify-center p-8 ${className}`}
      >
        <h1 className="text-2xl font-bold mb-8">Vegetable Price Tracker</h1>
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-2 text-sm text-muted-foreground">{message}</p>
      </div>
    </div>
  );
}
