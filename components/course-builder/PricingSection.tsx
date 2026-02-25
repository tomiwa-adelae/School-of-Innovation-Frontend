"use client";

import { Control, useWatch } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { IconCurrencyDollar, IconInfinity, IconCrown } from "@tabler/icons-react";

const PRICING_OPTIONS = [
  {
    value: "FREE",
    label: "Free",
    description: "Anyone can enrol at no cost",
    icon: IconInfinity,
    color: "border-green-500 bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-300",
    ring: "ring-green-500",
  },
  {
    value: "PAID",
    label: "Paid",
    description: "One-time purchase price",
    icon: IconCurrencyDollar,
    color: "border-blue-500 bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300",
    ring: "ring-blue-500",
  },
  {
    value: "SUBSCRIPTION",
    label: "Subscription",
    description: "Accessible via subscription plan",
    icon: IconCrown,
    color: "border-purple-500 bg-purple-50 dark:bg-purple-950/30 text-purple-700 dark:text-purple-300",
    ring: "ring-purple-500",
  },
] as const;

interface PricingSectionProps {
  control: Control<any>;
}

export function PricingSection({ control }: PricingSectionProps) {
  const pricingType = useWatch({ control, name: "pricingType" });

  return (
    <div className="space-y-4">
      <p className="text-sm font-bold text-gray-700 dark:text-gray-300">Pricing</p>

      <div className="grid grid-cols-3 gap-3">
        {PRICING_OPTIONS.map(({ value, label, description, icon: Icon, color, ring }) => (
          <FormField
            key={value}
            control={control}
            name="pricingType"
            render={({ field }) => (
              <button
                type="button"
                onClick={() => field.onChange(value)}
                className={cn(
                  "p-4 rounded-2xl border-2 text-left transition-all",
                  pricingType === value
                    ? `${color} ring-2 ${ring}`
                    : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:border-gray-300"
                )}
              >
                <Icon size={20} className="mb-2" />
                <p className="text-sm font-bold">{label}</p>
                <p className="text-xs text-muted-foreground mt-0.5 leading-snug">
                  {description}
                </p>
              </button>
            )}
          />
        ))}
      </div>

      {(pricingType === "PAID" || pricingType === "SUBSCRIPTION") && (
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-bold">Price (USD)</FormLabel>
                <FormControl>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                      $
                    </span>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      className="pl-6 rounded-xl"
                      value={field.value ?? ""}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value ? parseFloat(e.target.value) : undefined
                        )
                      }
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="currency"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-bold">Currency</FormLabel>
                <FormControl>
                  <Input
                    placeholder="USD"
                    className="rounded-xl"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      )}
    </div>
  );
}
