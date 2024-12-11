"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import CreatableSelect from "react-select/creatable";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import { addPurchase, getVegetables } from "@/lib/firebase-utils";
import { useRouter } from "next/navigation";
import { Vegetable } from "@/lib/types";

type VegetableOption = {
  value: string;
  label: string;
  isNew?: boolean;
};

export default function AddPurchase() {
  const [vegetables, setVegetables] = useState<Vegetable[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

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

  const vegetableOptions: VegetableOption[] = vegetables.map((veg) => ({
    value: veg.id,
    label: veg.name,
  }));

  const [formData, setFormData] = useState({
    vegetableId: "",
    vegetableName: "",
    quantity: "",
    unit: "kg",
    price: "",
    date: new Date().toISOString().split("T")[0],
  });

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const existingVegetable = vegetables.find(
        (v) => v.name.toLowerCase() === formData.vegetableName.toLowerCase()
      );

      const pricePerKg =
        formData.unit === "gram"
          ? (Number(formData.price) / Number(formData.quantity)) * 1000
          : Number(formData.price);

      await addPurchase({
        vegetableId: existingVegetable
          ? existingVegetable.id
          : formData.vegetableName.toLowerCase().replace(/\s+/g, "-") +
            Math.random().toString(36).substring(2, 15),
        vegetableName: formData.vegetableName,
        quantity: Number(formData.quantity),
        unit: formData.unit as "kg" | "gram",
        price: Number(formData.price),
        date: formData.date,
        prices: {
          kg: pricePerKg,
          gram: pricePerKg / 1000,
          originalUnit: formData.unit as "kg" | "gram",
          originalPrice: Number(formData.price),
        },
      });

      router.push("/");
    } catch (error) {
      console.error("Error adding purchase:", error);
      setIsSaving(false);
    }
  };

  if (loading) {
    return <div>Loading vegetables...</div>;
  }

  return (
    <div className="container max-w-2xl mx-auto py-8 px-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h1 className="text-2xl font-bold">Add Purchase</h1>
        <Button asChild variant="outline" className="w-full sm:w-auto">
          <Link href="/">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="vegetable">Vegetable</Label>
          <CreatableSelect
            inputId="vegetable"
            options={vegetableOptions}
            value={vegetableOptions.find(
              (opt) => opt.label === formData.vegetableName
            )}
            onChange={(option) =>
              setFormData({
                ...formData,
                vegetableName: option?.label || "",
              })
            }
            placeholder="Select or create a vegetable"
            className="react-select"
            classNamePrefix="react-select"
            isDisabled={loading}
          />
        </div>

        <div className="flex gap-4">
          <div className="space-y-2 flex-1">
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              id="quantity"
              type="number"
              step="0.1"
              min="0"
              value={formData.quantity}
              onChange={(e) =>
                setFormData({ ...formData, quantity: e.target.value })
              }
              placeholder="Enter quantity"
            />
          </div>
          <div className="space-y-2 w-24">
            <Label htmlFor="unit">Unit</Label>
            <select
              id="unit"
              value={formData.unit}
              onChange={(e) =>
                setFormData({ ...formData, unit: e.target.value })
              }
              className="w-full h-10 px-3 rounded-md border border-input bg-background"
            >
              <option value="kg">kg</option>
              <option value="gram">gram</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="price">Price per {formData.unit}</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            min="0"
            value={formData.price}
            onChange={(e) =>
              setFormData({ ...formData, price: e.target.value })
            }
            placeholder="Enter price"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="date">Purchase Date</Label>
          <Input
            id="date"
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          />
        </div>

        <Button disabled={isSaving} type="submit" className="w-full">
          {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          {isSaving ? "Saving..." : "Save Purchase"}
        </Button>
      </form>
    </div>
  );
}
