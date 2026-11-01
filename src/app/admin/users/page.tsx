import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/session";
import { setUserRole } from "../actions";

export default async function AdminUsers() {
  const me = await requireAdmin();
  const users = await db.user.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
    select: { id: true, email: true, name: true, role: true, createdAt: true, _count: { select: { saved: true } } },
  });
  return (
    <div>
      <h1 className="text-2xl font-extrabold">Users</h1>
      <div className="card mt-4 overflow-x-auto">
        <table className="w-full min-w-[620px] text-left text-sm">
          <thead className="border-b border-line text-xs uppercase tracking-wide text-muted">
            <tr><th className="p-3">User</th><th className="p-3">Joined</th><th className="p-3">Saved</th><th className="p-3">Role</th></tr>
          </thead>
          <tbody className="divide-y divide-line">
            {users.map((u) => (
              <tr key={u.id}>
                <td className="p-3"><p className="font-semibold text-ink">{u.name ?? "—"}</p><p className="text-xs text-muted">{u.email}</p></td>
                <td className="p-3 tabular-nums">{u.createdAt.toISOString().slice(0, 10)}</td>
                <td className="p-3 tabular-nums">{u._count.saved}</td>
                <td className="p-3">
                  {u.id === me.id ? (
                    <span className="font-semibold">Admin (you)</span>
                  ) : (
                    <form action={setUserRole} className="flex items-center gap-2">
                      <input type="hidden" name="id" value={u.id} />
                      <input type="hidden" name="role" value={u.role === "ADMIN" ? "USER" : "ADMIN"} />
                      <span>{u.role === "ADMIN" ? "Admin" : "User"}</span>
                      <button className="text-xs font-semibold text-brand hover:underline">{u.role === "ADMIN" ? "Make user" : "Make admin"}</button>
                    </form>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
