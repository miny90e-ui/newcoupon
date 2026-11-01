import {
  Shirt, Sparkles, Laptop, Plane, Sofa, Utensils, Bike, HeartPulse, Gift, Baby, Car, PawPrint,
  Gamepad2, BookOpen, ShoppingBag, Gem, Dumbbell, Music, Smartphone, Tag, type LucideIcon,
} from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  shirt: Shirt, sparkles: Sparkles, laptop: Laptop, plane: Plane, sofa: Sofa, utensils: Utensils,
  bike: Bike, "heart-pulse": HeartPulse, gift: Gift, baby: Baby, car: Car, "paw-print": PawPrint,
  gamepad: Gamepad2, book: BookOpen, "shopping-bag": ShoppingBag, gem: Gem, dumbbell: Dumbbell,
  music: Music, smartphone: Smartphone, tag: Tag,
};

export const CATEGORY_ICON_NAMES = Object.keys(ICONS);

export function CategoryIcon({ name, className }: { name?: string | null; className?: string }) {
  const Icon = (name && ICONS[name]) || Tag;
  return <Icon className={className} aria-hidden />;
}
