import type { Metadata } from "next";
import Link from "next/link";
import { LayoutDashboard, Store, Ticket, FolderTree, Images, Users, Upload, Sheet } from "lucide-react";
import { requireAdmin } from "@/lib/session";

export const metadata: Metadata = { title: "Admin", robots: { index: false, follow: false } };

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/stores", label: "Stores", icon: Store },
  { href: "/admin/coupons", label: "Coupons", icon: Ticket },
  { href: "/admin/categories", label: "Categories", icon: FolderTree },
  { href: "/admin/banners", label: "Homepage banners", icon: Images },
  { href: "/admin/google-sheet", label: "Google Sheet", icon: Sheet },
  { href: "/admin/import", label: "Import (Excel / CSV)", icon: Upload },
  { href: "/admin/users", label: "Users", icon: Users },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await requireAdmin();
  return (
    <div className="container-page grid gap-8 py-8 lg:grid-cols-[220px_1fr]">
      <aside>
        <p className="text-xs font-bold uppercase tracking-wider text-muted">Admin · {user.email}</p>
        <nav aria-label="Admin" className="mt-3">
          <ul className="flex gap-1 overflow-x-auto lg:flex-col">
            {NAV.map(({ href, label, icon: Icon }) => (
              <li key={href}>
                <Link href={href} className="flex min-h-11 items-center gap-2.5 whitespace-nowrap rounded-lg px-3 text-sm font-semibold text-ink hover:bg-surface">
                  <Icon className="size-4 text-muted" aria-hidden /> {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      <div className="min-w-0">{children}</div>
    </div>
  );
}
