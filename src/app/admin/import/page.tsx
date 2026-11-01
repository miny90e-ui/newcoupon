import { AdminForm } from "@/components/admin-form";
import { importCoupons, importStores, importWorkbook } from "../actions";

const fileInput = "block w-full text-sm file:mr-3 file:min-h-11 file:cursor-pointer file:rounded-full file:border-0 file:bg-canvas file:px-4 file:font-semibold";

export default function ImportPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold">Import</h1>
        <p className="mt-1 text-sm text-muted">
          Keep all stores and coupons in one spreadsheet and upload it whenever you change something. Importing again
          updates what is already on the site (same store slug, same coupon code — or same title for deals) instead of
          adding duplicates. Set <code className="rounded bg-canvas px-1">active</code> to <code className="rounded bg-canvas px-1">no</code> to hide a coupon.
        </p>
      </div>

      <section className="card space-y-4 border-brand p-6">
        <h2 className="text-lg font-bold">Excel workbook (recommended)</h2>
        <p className="text-sm text-muted">
          One <code className="rounded bg-canvas px-1">.xlsx</code> file with a tab named <code className="rounded bg-canvas px-1">stores</code> and a tab
          named <code className="rounded bg-canvas px-1">coupons</code>. Stores are imported first, then coupons. From Google Sheets use
          File → Download → Microsoft Excel (.xlsx).{" "}
          <a href="/templates/new-coupon-data.xlsx" className="link" download>Download the template</a>
        </p>
        <AdminForm action={importWorkbook} submitLabel="Import workbook">
          <label htmlFor="workbook-file" className="label">Excel file</label>
          <input id="workbook-file" name="file" type="file" accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" required className={fileInput} />
        </AdminForm>
      </section>

      <p className="text-sm font-semibold text-muted">Or import CSV files one at a time:</p>

      <section className="card space-y-4 p-6">
        <h2 className="text-lg font-bold">1. Stores</h2>
        <p className="text-sm text-muted">
          Columns: <code className="rounded bg-canvas px-1">name</code>*, <code className="rounded bg-canvas px-1">affiliate_url</code>*,{" "}
          <code className="rounded bg-canvas px-1">slug</code>, <code className="rounded bg-canvas px-1">website</code>,{" "}
          <code className="rounded bg-canvas px-1">logo_url</code>, <code className="rounded bg-canvas px-1">category</code>,{" "}
          <code className="rounded bg-canvas px-1">description</code>, <code className="rounded bg-canvas px-1">featured</code> (yes/no).
          A store with the same slug is updated instead of duplicated.{" "}
          <a href="/templates/stores.csv" className="link" download>Download template</a>
        </p>
        <AdminForm action={importStores} submitLabel="Import stores">
          <label htmlFor="stores-file" className="label">Stores CSV</label>
          <input id="stores-file" name="file" type="file" accept=".csv,text/csv" required className={fileInput} />
        </AdminForm>
      </section>

      <section className="card space-y-4 p-6">
        <h2 className="text-lg font-bold">2. Coupons</h2>
        <p className="text-sm text-muted">
          Columns: <code className="rounded bg-canvas px-1">store</code>* (name or slug), <code className="rounded bg-canvas px-1">title</code>*,{" "}
          <code className="rounded bg-canvas px-1">code</code> (empty = deal), <code className="rounded bg-canvas px-1">discount</code> (e.g. 20% OFF),{" "}
          <code className="rounded bg-canvas px-1">tag</code>, <code className="rounded bg-canvas px-1">expires_at</code> (YYYY-MM-DD),{" "}
          <code className="rounded bg-canvas px-1">affiliate_url</code>, <code className="rounded bg-canvas px-1">description</code>,{" "}
          <code className="rounded bg-canvas px-1">featured</code>, <code className="rounded bg-canvas px-1">exclusive</code>, <code className="rounded bg-canvas px-1">active</code>.{" "}
          <a href="/templates/coupons.csv" className="link" download>Download template</a>
        </p>
        <AdminForm action={importCoupons} submitLabel="Import coupons">
          <label htmlFor="coupons-file" className="label">Coupons CSV</label>
          <input id="coupons-file" name="file" type="file" accept=".csv,text/csv" required className={fileInput} />
        </AdminForm>
      </section>
    </div>
  );
}
