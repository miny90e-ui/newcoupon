import { AdminForm } from "@/components/admin-form";
import { TextField } from "@/components/admin-fields";
import { getLastSync, getSheetUrl } from "@/lib/sheet-sync";
import { saveSheetUrl, syncSheetNow } from "../actions";

export default async function GoogleSheetPage() {
  const [url, last] = await Promise.all([getSheetUrl(), getLastSync()]);
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold">Google Sheet</h1>
        <p className="mt-1 text-sm text-muted">
          Quản lý cửa hàng và coupon trong Google Sheet. Website tự đồng bộ mỗi ngày một lần, hoặc bấm <b>Sync now</b> để cập nhật ngay.
        </p>
      </div>

      <section className="card space-y-4 p-6">
        <h2 className="text-lg font-bold">1. Link Google Sheet</h2>
        <AdminForm action={saveSheetUrl} submitLabel={url ? "Save & sync" : "Link & sync"}>
          <TextField
            name="sheetUrl"
            label="Google Sheets link"
            type="url"
            defaultValue={url}
            placeholder="https://docs.google.com/spreadsheets/d/…/edit"
            hint="Để trống rồi bấm Save để huỷ liên kết."
          />
        </AdminForm>
        {url && (
          <a href={url} target="_blank" rel="noopener noreferrer" className="link text-sm">
            Mở Google Sheet
          </a>
        )}
      </section>

      {url && (
        <section className="card space-y-4 p-6">
          <h2 className="text-lg font-bold">2. Đồng bộ</h2>
          {last && (
            <div className={`rounded-lg px-3 py-2.5 text-sm ${last.ok ? "bg-brand-tint" : "bg-red-50 text-danger"}`}>
              <p className="font-semibold">
                Lần đồng bộ gần nhất: {new Date(last.at).toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" })} —{" "}
                {last.ok ? "thành công" : "lỗi"}
              </p>
              <p>{last.message}</p>
              {last.errors.length > 0 && <p className="mt-1 whitespace-pre-line text-danger">{last.errors.join("\n")}</p>}
            </div>
          )}
          <AdminForm action={syncSheetNow} submitLabel="Sync now">
            <p className="text-sm text-muted">Tự động đồng bộ mỗi ngày lúc 6:00 sáng (giờ Việt Nam).</p>
          </AdminForm>
        </section>
      )}

      <section className="card space-y-2 p-6 text-sm leading-relaxed">
        <h2 className="text-lg font-bold">Cách tạo Google Sheet (một lần)</h2>
        <ol className="list-decimal space-y-1 pl-5">
          <li>
            Tải <a href="/templates/new-coupon-data.xlsx" className="link" download>file mẫu</a> (hoặc dùng file NewCoupon-data.xlsx của bạn).
          </li>
          <li>Mở drive.google.com → Mới → Tải tệp lên → chọn file. Nhấp đúp file → Mở bằng Google Trang tính.</li>
          <li>Trong Google Sheets: Tệp → Lưu dưới dạng Google Trang tính (để sửa trực tiếp được).</li>
          <li>Bấm Chia sẻ → Quyền truy cập chung → &ldquo;Bất kỳ ai có đường liên kết&rdquo; → Người xem.</li>
          <li>Copy link trên thanh địa chỉ, dán vào ô ở trên, bấm Link &amp; sync.</li>
        </ol>
        <p className="text-muted">
          Cách đơn giản nhất: một tab, mỗi dòng gồm <b>Cửa hàng</b>, <b>Link affiliate</b>, <b>Mã coupon</b>, <b>Giảm</b>,
          <b> Ưu đãi</b>, <b>Hết hạn</b>, <b>Ngành hàng</b>, <b>Logo</b>, <b>Ghi chú</b>, <b>Hiện</b>. Hai tab
          <code className="rounded bg-canvas px-1">stores</code> + <code className="rounded bg-canvas px-1">coupons</code> kiểu cũ vẫn dùng được.
          Sheet ở chế độ chỉ xem nên người khác không sửa được, nhưng ai có link đều xem được.
        </p>
      </section>
    </div>
  );
}
