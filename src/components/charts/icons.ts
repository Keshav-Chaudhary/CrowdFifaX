import type { Category } from "@/services/emissions/types";
import type { LucideIcon } from "lucide-react";
import {
  Bus,
  Car,
  Bike,
  Plane,
  Train,
  Zap,
  Flame,
  Beef,
  Drumstick,
  Salad,
  Sprout,
  Shirt,
  Smartphone,
  Trash2,
  Activity,
  Utensils,
  ShoppingBag,
} from "lucide-react";

/** CSS colour token per category, mirrored from the design system. */
export const CATEGORY_COLOR_VAR: Record<Category, string> = {
  transport: "var(--color-transport)",
  energy: "var(--color-energy)",
  diet: "var(--color-diet)",
  shopping: "var(--color-shopping)",
  waste: "var(--color-waste)",
  custom: "var(--color-custom)",
};

/** Icon per category for headers and legends. */
export const CATEGORY_ICON: Record<Category, LucideIcon> = {
  transport: Car,
  energy: Zap,
  diet: Utensils,
  shopping: ShoppingBag,
  waste: Trash2,
  custom: Activity,
};

/** Icon per individual emission factor, used in lists and the log form. */
export const FACTOR_ICON: Record<string, LucideIcon> = {
  car_petrol: Car,
  car_electric: Car,
  bus: Bus,
  train: Train,
  flight_short: Plane,
  bike_walk: Bike,
  electricity: Zap,
  natural_gas: Flame,
  meal_beef: Beef,
  meal_poultry: Drumstick,
  meal_vegetarian: Salad,
  meal_vegan: Sprout,
  clothing_item: Shirt,
  electronics_spend: Smartphone,
};
