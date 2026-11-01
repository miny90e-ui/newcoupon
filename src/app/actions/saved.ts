"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { getSession } from "@/lib/session";

export async function toggleSaved(couponId: string): Promise<{ saved?: boolean; needsLogin?: boolean }> {
  const session = await getSession();
  if (!session) return { needsLogin: true };
  const key = { userId_couponId: { userId: session.userId, couponId } };
  const existing = await db.savedCoupon.findUnique({ where: key });
  if (existing) {
    await db.savedCoupon.delete({ where: key });
  } else {
    const coupon = await db.coupon.findUnique({ where: { id: couponId }, select: { id: true } });
    if (!coupon) return { saved: false };
    await db.savedCoupon.create({ data: { userId: session.userId, couponId } });
  }
  revalidatePath("/account");
  return { saved: !existing };
}
