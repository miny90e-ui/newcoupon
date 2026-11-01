# Đưa New Coupon lên mạng miễn phí với Vercel + Neon

Toàn bộ thao tác làm trên trình duyệt, mất khoảng 10 phút. Bạn không phải cài gì lên máy, và cũng không cần gửi mật khẩu cho ai.

- **Vercel:** chạy website và lấy code từ GitHub `miny90e-ui/newcoupon`.
- **Neon:** cơ sở dữ liệu PostgreSQL, tạo ngay bên trong Vercel.
- **Vercel Blob:** nơi lưu logo và banner bạn upload.

> Gói miễn phí Hobby của Vercel ghi rõ dùng cho mục đích **phi thương mại**. Website affiliate có thu nhập thì nên nâng lên gói Pro (khoảng 20 USD/tháng) hoặc chuyển sang VPS theo [DEPLOY.md](DEPLOY.md). Code không cần sửa gì khi chuyển.

---

## Bước 1: Tạo tài khoản Vercel

1. Mở https://vercel.com/signup
2. Chọn **Hobby** và đặt tên tùy ý.
3. Bấm **Continue with GitHub**, đăng nhập GitHub `miny90e-ui`, rồi bấm **Authorize**.

## Bước 2: Nhập dự án từ GitHub (chưa bấm Deploy)

1. Mở https://vercel.com/new
2. Ở danh sách repo, tìm `newcoupon` và bấm **Import**. Nếu không thấy repo, bấm **Adjust GitHub App Permissions** và cho phép Vercel truy cập repo này.
3. **Framework Preset** phải là **Next.js** (thường Vercel tự nhận).
4. Mở mục **Environment Variables** và thêm từng dòng:

| Name | Value |
|------|-------|
| `AUTH_SECRET` | một chuỗi ngẫu nhiên **dài ít nhất 32 ký tự**. Tạo bằng cách chạy `openssl rand -base64 48` trong Terminal rồi copy kết quả |
| `ADMIN_EMAIL` | email bạn dùng để đăng nhập trang quản trị |
| `ADMIN_PASSWORD` | mật khẩu admin, **ít nhất 8 ký tự** |
| `SEED_SAMPLE` | `true` nếu muốn có sẵn 10 cửa hàng mẫu để xem thử, `false` nếu muốn bắt đầu trống |
| `CONTACT_EMAIL` | email liên hệ hiện trên website |

5. Bấm **Deploy**. Lần này build sẽ **báo lỗi** vì chưa có database. Đó là điều bình thường, bước 3 sẽ sửa.

## Bước 3: Tạo database Neon

1. Trong project `newcoupon` trên Vercel, mở tab **Storage**.
2. Bấm **Create Database**, chọn **Neon (Serverless Postgres)**, rồi bấm **Continue**.
3. **Region:** chọn **Singapore (ap-southeast-1)** cho gần Việt Nam và gần server Vercel đã cài sẵn.
4. **Plan:** chọn **Free**. Đặt tên, ví dụ `newcoupon-db`.
5. Bấm **Create**, rồi **Connect** vào project `newcoupon`. Giữ tick ở cả 3 môi trường Production, Preview và Development.

Vercel sẽ tự thêm các biến `DATABASE_URL` và `DATABASE_URL_UNPOOLED`. Kiểm tra tại **Settings → Environment Variables**. Nếu không thấy `DATABASE_URL_UNPOOLED`, hãy tự tạo biến đó, giá trị là chuỗi kết nối **không có** chữ `-pooler`, lấy trong trang Neon → **Connection string**.

## Bước 4: Tạo chỗ lưu ảnh (Vercel Blob)

1. Vẫn ở tab **Storage**, bấm **Create Database** rồi chọn **Blob**.
2. Đặt tên, ví dụ `newcoupon-images`, chọn **Create**, rồi **Connect** vào project.

Vercel sẽ tự thêm biến `BLOB_READ_WRITE_TOKEN`.

## Bước 5: Deploy lại

1. Mở tab **Deployments**.
2. Ở bản deploy mới nhất, bấm dấu `⋯` rồi chọn **Redeploy**.

Lần này quá trình build sẽ tự làm các việc sau:
- tạo các bảng trong database,
- tạo tài khoản admin từ `ADMIN_EMAIL` và `ADMIN_PASSWORD`,
- tạo 8 ngành hàng, và thêm dữ liệu mẫu nếu `SEED_SAMPLE=true`,
- build website.

Khi trạng thái chuyển sang **Ready**, bấm **Visit** để xem website, thường có dạng `https://newcoupon-xxxx.vercel.app`.

## Bước 6: Cập nhật địa chỉ website

1. Vào **Settings → Environment Variables** và thêm `SITE_URL` với giá trị là địa chỉ website, **không có `/` ở cuối**, ví dụ `https://newcoupon-xxxx.vercel.app`.
2. **Redeploy** một lần nữa để sitemap và SEO dùng đúng địa chỉ.

## Đăng nhập trang quản trị

Vào `https://<địa-chỉ-website>/admin` và đăng nhập bằng `ADMIN_EMAIL` cùng `ADMIN_PASSWORD` bạn đã đặt.

---

## Từ giờ trở đi

- **Mỗi lần push code lên GitHub nhánh `main`, Vercel tự build và cập nhật website**, không cần làm gì thêm.
- **Gắn tên miền riêng:** vào **Settings → Domains**, thêm tên miền và làm theo hướng dẫn trỏ DNS của Vercel. Xong thì đổi `SITE_URL` thành tên miền mới và Redeploy.
- **Đổi mật khẩu admin:** sửa `ADMIN_PASSWORD` rồi Redeploy **không** đổi được mật khẩu của tài khoản đã tồn tại. Muốn đổi, hãy nhờ mình thêm chức năng đổi mật khẩu.
- **Xem lỗi:** tab **Logs** của project trên Vercel.

## Giới hạn của gói miễn phí

- **Neon Free:** khoảng 0,5 GB dữ liệu. Database tự "ngủ" khi không có truy cập, lần mở đầu tiên sau đó chậm hơn khoảng 1 giây.
- **Vercel Blob và Vercel Hobby:** có hạn mức dung lượng và băng thông mỗi tháng, đủ cho website mới.
- Giới hạn có thể thay đổi, bạn xem con số chính xác trên trang giá của Vercel và Neon.
