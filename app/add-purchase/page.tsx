"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import CreatableSelect from "react-select/creatable";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import {
  addPurchase,
  getVegetables,
  getPurchase,
  updatePurchase,
} from "@/lib/firebase-utils";
import { useRouter, useSearchParams } from "next/navigation";
import { Vegetable } from "@/lib/types";
import { toast } from "sonner";
import { Loading } from "@/components/ui/loading";
import { DatePicker } from "@/components/ui/date-picker";

type VegetableOption = {
  value: string;
  label: string;
  isNew?: boolean;
};

interface FormErrors {
  vegetableName?: string;
  quantity?: string;
  price?: string;
  date?: string;
}

// Toast styles
const toastStyles = {
  success: { backgroundColor: "#10B981", color: "white" }, // Emerald-500
  error: { backgroundColor: "#EF4444", color: "white" }, // Red-500
  warning: { backgroundColor: "#F59E0B", color: "white" }, // Amber-500
};

export default function AddPurchase() {
  const [vegetables, setVegetables] = useState<Vegetable[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const selectRef = useRef<any>(null);

  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");
  const isEditing = !!editId;

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getVegetables();
        setVegetables(data);

        if (isEditing) {
          const purchase = await getPurchase(editId!);
          if (purchase) {
            setFormData({
              vegetableId: purchase.vegetableId,
              vegetableName: purchase.vegetableName,
              quantity: purchase.quantity.toString(),
              unit: purchase.unit,
              price: purchase.price.toString(),
              date: purchase.date,
            });
          }
        }
      } catch (error) {
        console.error("Error loading data:", error);
        toast.error("Failed to load data", {
          style: { backgroundColor: "rgb(239 68 68)", color: "white" },
        });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [editId, isEditing]);

  const vegetableOptions: VegetableOption[] = vegetables.map((veg) => ({
    value: veg.id,
    label: veg.name,
  }));

  const [formData, setFormData] = useState({
    vegetableId: "",
    vegetableName: "",
    quantity: "",
    unit: "gram",
    price: "",
    date: new Date().toISOString(),
  });

  const router = useRouter();

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Validate vegetable name
    if (!formData.vegetableName.trim()) {
      newErrors.vegetableName = "Vegetable name is required";
    }

    // Validate quantity
    if (!formData.quantity) {
      newErrors.quantity = "Quantity is required";
    } else if (Number(formData.quantity) <= 0) {
      newErrors.quantity = "Quantity must be greater than 0";
    }

    // Validate price
    if (!formData.price) {
      newErrors.price = "Price is required";
    } else if (Number(formData.price) <= 0) {
      newErrors.price = "Price must be greater than 0";
    }

    // Validate date
    if (!formData.date) {
      newErrors.date = "Date is required";
    } else if (new Date(formData.date) > new Date()) {
      newErrors.date = "Date cannot be in the future";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Validation Error", {
        style: toastStyles.error,
      });
      return;
    }

    setIsSaving(true);
    try {
      const existingVegetable = vegetables.find(
        (v) => v.name.toLowerCase() === formData.vegetableName.toLowerCase()
      );

      const pricePerKg =
        formData.unit === "gram"
          ? (Number(formData.price) / Number(formData.quantity)) * 1000
          : Number(formData.price) / Number(formData.quantity);

      const purchaseData = {
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
      };

      if (isEditing) {
        await updatePurchase(editId!, purchaseData);
        toast.success("Purchase updated successfully", {
          style: toastStyles.success,
        });
        router.push("/table-view");
      } else {
        await addPurchase(purchaseData);
        toast.success("Purchase added successfully", {
          style: toastStyles.success,
        });

        // Clear the select using ref
        if (selectRef.current) {
          selectRef.current.clearValue();
        }

        // Reset form including select field
        setFormData({
          vegetableId: "",
          vegetableName: "",
          quantity: "",
          unit: "gram",
          price: "",
          date: new Date().toISOString().split("T")[0],
        });
        setErrors({});
      }
    } catch (error) {
      console.error("Error saving purchase:", error);
      toast.error(`Failed to ${isEditing ? "update" : "add"} purchase`);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return <Loading message="Loading vegetables..." />;
  }

  return (
    <div className="container max-w-2xl mx-auto py-8 px-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h1 className="text-2xl font-bold">
          {isEditing ? "Edit Purchase" : "Add Purchase"}
        </h1>
        <Button asChild variant="outline" className="w-full sm:w-auto ">
          <Link href="/table-view">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Table View
          </Link>
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="vegetable">Vegetable</Label>
          <CreatableSelect
            ref={selectRef}
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
          {errors.vegetableName && (
            <p className="text-sm text-destructive mt-1">
              {errors.vegetableName}
            </p>
          )}
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
            {errors.quantity && (
              <p className="text-sm text-destructive mt-1">{errors.quantity}</p>
            )}
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
              <option value="gram">gram</option>
              <option value="kg">kg</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="price">Price</Label>
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
          {errors.price && (
            <p className="text-sm text-destructive mt-1">{errors.price}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="date">Purchase Date</Label>
          <DatePicker
            date={formData.date ? new Date(formData.date) : undefined}
            onDateChange={(date) =>
              setFormData({
                ...formData,
                date: date ? date.toISOString().split("T")[0] : "",
              })
            }
          />
          {errors.date && (
            <p className="text-sm text-destructive mt-1">{errors.date}</p>
          )}
        </div>

        <Button disabled={isSaving} type="submit" className="w-full ">
          {isSaving
            ? "Saving..."
            : isEditing
            ? "Update Purchase"
            : "Add Purchase"}
        </Button>
      </form>
    </div>
  );
}
