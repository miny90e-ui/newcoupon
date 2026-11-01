import { PrismaClient, CouponType } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const categories = [
  { name: "Fashion", slug: "fashion", icon: "shirt", description: "Clothing, shoes and accessories." },
  { name: "Beauty", slug: "beauty", icon: "sparkles", description: "Skincare, makeup and fragrance." },
  { name: "Electronics", slug: "electronics", icon: "laptop", description: "Phones, laptops, audio and gadgets." },
  { name: "Travel", slug: "travel", icon: "plane", description: "Flights, hotels and car rentals." },
  { name: "Home & Garden", slug: "home-garden", icon: "sofa", description: "Furniture, decor and outdoor living." },
  { name: "Food & Dining", slug: "food-dining", icon: "utensils", description: "Restaurants, delivery and groceries." },
  { name: "Sports & Outdoors", slug: "sports-outdoors", icon: "bike", description: "Gear, apparel and fitness." },
  { name: "Health & Wellness", slug: "health-wellness", icon: "heart-pulse", description: "Vitamins, fitness and self-care." },
];

// Fictional sample stores. Replace them with your real stores in the admin panel.
const stores = [
  { name: "Northwind Outfitters", slug: "northwind-outfitters", cat: "fashion", featured: true },
  { name: "Lumen Tech", slug: "lumen-tech", cat: "electronics", featured: true },
  { name: "Bloom & Co", slug: "bloom-and-co", cat: "beauty", featured: true },
  { name: "Skyward Travel", slug: "skyward-travel", cat: "travel", featured: true },
  { name: "Oakline Home", slug: "oakline-home", cat: "home-garden", featured: true },
  { name: "Fresh Fork", slug: "fresh-fork", cat: "food-dining", featured: false },
  { name: "Summit Gear", slug: "summit-gear", cat: "sports-outdoors", featured: true },
  { name: "Vitality Labs", slug: "vitality-labs", cat: "health-wellness", featured: false },
  { name: "Urban Thread", slug: "urban-thread", cat: "fashion", featured: false },
  { name: "Pixel Point", slug: "pixel-point", cat: "electronics", featured: false },
];

type SampleCoupon = {
  store: string;
  title: string;
  code?: string;
  discountLabel: string;
  tag?: string;
  featured?: boolean;
  exclusive?: boolean;
  days?: number;
};

const coupons: SampleCoupon[] = [
  { store: "northwind-outfitters", title: "Extra 20% off your entire order", code: "NORTH20", discountLabel: "20% OFF", tag: "SITEWIDE", featured: true, days: 14 },
  { store: "northwind-outfitters", title: "Free shipping on orders over $50", discountLabel: "FREE SHIP", tag: "ONLINE ONLY", days: 30 },
  { store: "northwind-outfitters", title: "Up to 60% off clearance styles", discountLabel: "60% OFF", tag: "CLEARANCE" },
  { store: "lumen-tech", title: "$50 off laptops over $799", code: "LUMEN50", discountLabel: "$50 OFF", tag: "ONLINE ONLY", featured: true, days: 10 },
  { store: "lumen-tech", title: "15% off headphones and speakers", code: "SOUND15", discountLabel: "15% OFF", days: 21 },
  { store: "lumen-tech", title: "Students save 10% with verification", discountLabel: "10% OFF", tag: "STUDENTS" },
  { store: "bloom-and-co", title: "25% off your first order when you sign up", code: "BLOOMNEW", discountLabel: "25% OFF", tag: "NEW CUSTOMERS", featured: true, exclusive: true, days: 30 },
  { store: "bloom-and-co", title: "Free deluxe sample set with any $40 purchase", discountLabel: "FREE GIFT", tag: "SITEWIDE", days: 7 },
  { store: "skyward-travel", title: "Save $40 on hotel stays of 3+ nights", code: "STAY40", discountLabel: "$40 OFF", tag: "ONLINE ONLY", featured: true, days: 45 },
  { store: "skyward-travel", title: "Up to 30% off last-minute flight deals", discountLabel: "30% OFF", days: 5 },
  { store: "oakline-home", title: "20% off all outdoor furniture", code: "PATIO20", discountLabel: "20% OFF", tag: "SITEWIDE", featured: true, days: 20 },
  { store: "oakline-home", title: "Free delivery on orders over $299", discountLabel: "FREE SHIP" },
  { store: "fresh-fork", title: "$15 off your first meal kit box", code: "FORK15", discountLabel: "$15 OFF", tag: "NEW CUSTOMERS", featured: true, days: 30 },
  { store: "summit-gear", title: "Extra 15% off sale items", code: "TRAIL15", discountLabel: "15% OFF", tag: "SITEWIDE", featured: true, days: 12 },
  { store: "summit-gear", title: "Members get free returns all year", discountLabel: "FREE RETURNS", tag: "MEMBERS" },
  { store: "vitality-labs", title: "Buy one, get one 50% off vitamins", discountLabel: "BOGO 50%", tag: "ONLINE ONLY", featured: true, days: 9 },
  { store: "urban-thread", title: "35% off when you join the rewards club", code: "THREAD35", discountLabel: "35% OFF", tag: "MEMBERS", featured: true, days: 25 },
  { store: "pixel-point", title: "$20 off smart home bundles", code: "SMART20", discountLabel: "$20 OFF", featured: true, days: 18 },
];

async function main() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (email && password) {
    if (password.length < 8 || password === "CHANGE_ME") {
      throw new Error("ADMIN_PASSWORD must be at least 8 characters and not CHANGE_ME");
    }
    await prisma.user.upsert({
      where: { email: email.toLowerCase() },
      update: { role: "ADMIN" },
      create: {
        email: email.toLowerCase(),
        name: "Admin",
        role: "ADMIN",
        passwordHash: await bcrypt.hash(password, 12),
      },
    });
    console.log(`Admin account ready: ${email}`);
  }

  for (const [i, c] of categories.entries()) {
    await prisma.category.upsert({
      where: { slug: c.slug },
      update: {},
      create: { ...c, sortOrder: i },
    });
  }
  console.log(`Categories: ${categories.length}`);

  if (process.env.SEED_SAMPLE !== "true") return;

  for (const s of stores) {
    const category = await prisma.category.findUnique({ where: { slug: s.cat } });
    await prisma.store.upsert({
      where: { slug: s.slug },
      update: {},
      create: {
        name: s.name,
        slug: s.slug,
        featured: s.featured,
        website: `https://example.com/${s.slug}`,
        affiliateUrl: `https://example.com/${s.slug}?ref=newcoupon`,
        description: `Find the latest ${s.name} coupon codes, promo codes and deals, checked by the New Coupon team.`,
        categoryId: category?.id,
      },
    });
  }

  if ((await prisma.coupon.count()) === 0) {
    for (const c of coupons) {
      const store = await prisma.store.findUniqueOrThrow({ where: { slug: c.store } });
      await prisma.coupon.create({
        data: {
          storeId: store.id,
          type: c.code ? CouponType.CODE : CouponType.DEAL,
          title: c.title,
          code: c.code,
          discountLabel: c.discountLabel,
          tag: c.tag,
          featured: c.featured ?? false,
          exclusive: c.exclusive ?? false,
          expiresAt: c.days ? new Date(Date.now() + c.days * 86_400_000) : null,
        },
      });
    }
  }

  if ((await prisma.banner.count()) === 0) {
    await prisma.banner.createMany({
      data: [
        { title: "Fall savings across every category", subtitle: "Fresh codes from fashion, tech, travel and more — checked daily.", ctaLabel: "See best deals", linkUrl: "/deals", bgColor: "#0B2545", sortOrder: 0 },
        { title: "Up to 25% off beauty favourites", subtitle: "New customer offers from Bloom & Co.", ctaLabel: "Get the code", linkUrl: "/stores/bloom-and-co", bgColor: "#7A2E4A", sortOrder: 1 },
        { title: "Travel more, spend less", subtitle: "Hotel and flight deals from Skyward Travel.", ctaLabel: "View travel deals", linkUrl: "/categories/travel", bgColor: "#0F5257", sortOrder: 2 },
      ],
    });
  }
  console.log("Sample stores, coupons and banners seeded.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
