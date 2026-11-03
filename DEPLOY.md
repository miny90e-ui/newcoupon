# Hướng dẫn đưa New Coupon lên Hostinger

## Đang chạy: Hostinger Web Apps (gói Unlimited Web Hosting)

Website đang chạy dạng **Node.js Web App** trên gói Unlimited, không cần VPS:

- **Trang quản lý:** hPanel → Trang web → `offers-coupon.com` (https://hpanel.hostinger.com/websites/offers-coupon.com).
- **Code:** lấy từ repo GitHub công khai, nhánh `main`. Mỗi lần push, Hostinger tự build lại (khoảng 2 phút).
- **Build:** Next.js, Node 22, lệnh `npm run build`. Lệnh này dùng `next build --webpack` vì máy chủ Hostinger có glibc cũ, không chạy được trình biên dịch gốc của Next.js. File cấu hình là `next.config.mjs`, cũng vì lý do đó.
- **Database:** vẫn là Neon. Lấy chuỗi kết nối ở Vercel → Storage → neon-bole-field → `.env.local` (bấm Show secret).
- **Biến môi trường:** hPanel → trang web → Biến môi trường. Cần có `DATABASE_URL`, `DATABASE_URL_UNPOOLED`, `AUTH_SECRET`, `SITE_URL`, `SEED_SAMPLE=false` và `CONTACT_EMAIL`. Sau khi bấm **Áp dụng thay đổi**, Hostinger tự build lại.

Phần dưới đây là cách cũ dùng VPS, giữ lại để tham khảo.

---

# Cách cũ: GitHub và Hostinger VPS

Làm lần lượt từ trên xuống. Phần 1–5 chỉ làm **một lần**. Sau đó, mỗi lần bạn push code lên nhánh `main`, website tự cập nhật (phần 6).

Bạn cần có:
- Một VPS Hostinger chạy **Ubuntu 22.04 hoặc 24.04** (chọn khi cài VPS trong hPanel).
- Một tên miền (ví dụ `newcoupon.com`).
- Một tài khoản GitHub.

---

## 1. Đưa code lên GitHub

1. Vào https://github.com/new và tạo repository tên `new-coupon`, để **Private**. Không tick thêm README.
2. Trên máy Mac, mở Terminal trong thư mục dự án và chạy (thay `YOUR-USERNAME`):

```bash
git remote add origin git@github.com:YOUR-USERNAME/new-coupon.git
```

```bash
git push -u origin main
```

> File `.env` (chứa mật khẩu) đã nằm trong `.gitignore` nên **không** bị đẩy lên GitHub.

## 2. Trỏ tên miền về VPS

Trong trang quản lý tên miền, tạo 2 bản ghi DNS:

| Loại | Tên | Giá trị |
|------|-----|---------|
| A | `@` | địa chỉ IP của VPS (xem trong hPanel → VPS) |
| A | `www` | địa chỉ IP của VPS |

DNS có thể mất từ vài phút đến vài giờ mới có hiệu lực.

## 3. Cài đặt VPS (một lần)

Đăng nhập VPS bằng SSH (IP và mật khẩu root có trong hPanel):

```bash
ssh root@IP_CUA_VPS
```

Tải code về và chạy script cài đặt. Script sẽ cài Node.js 22, PostgreSQL, Nginx, PM2, Certbot và bật tường lửa:

```bash
git clone https://github.com/YOUR-USERNAME/new-coupon.git /var/www/new-coupon
```

```bash
bash /var/www/new-coupon/deploy/setup-vps.sh
```

> Repo để Private thì GitHub sẽ hỏi đăng nhập. Hãy dùng **Personal Access Token** thay cho mật khẩu: GitHub → Settings → Developer settings → Tokens. Hoặc thêm SSH deploy key cho VPS.

Ở cuối, script in ra một dòng `DATABASE_URL=...`. **Hãy chép lại dòng này**, bước sau cần dùng.

## 4. Tạo file cấu hình `.env` trên VPS

```bash
cd /var/www/new-coupon && cp .env.example .env && nano .env
```

Điền các giá trị sau:

| Biến | Giá trị |
|------|---------|
| `DATABASE_URL` và `DATABASE_URL_UNPOOLED` | hai dòng mà script ở bước 3 đã in ra (giống nhau) |
| `SITE_URL` | `https://newcoupon.com` (tên miền thật của bạn, không có `/` ở cuối) |
| `AUTH_SECRET` | chạy `openssl rand -base64 48` rồi dán kết quả vào |
| `ADMIN_EMAIL` | email bạn dùng để đăng nhập trang quản trị |
| `ADMIN_PASSWORD` | mật khẩu admin, tối thiểu 8 ký tự |
| `SEED_SAMPLE` | `false` (không tạo dữ liệu mẫu) |
| `UPLOAD_DIR` | `/var/www/new-coupon-uploads` |
| `CONTACT_EMAIL` | email liên hệ hiển thị trên website |

Lưu file: nhấn `Ctrl+O`, `Enter`, rồi `Ctrl+X`.

Tiếp theo, cài đặt, tạo bảng dữ liệu, tạo tài khoản admin và chạy website:

```bash
npm ci && npx prisma migrate deploy && npm run db:seed && npm run build
```

```bash
pm2 start ecosystem.config.cjs && pm2 save && pm2 startup
```

> Lệnh `pm2 startup` in ra thêm một lệnh nữa. Hãy chạy lệnh đó để website tự khởi động lại khi VPS reboot.

## 5. Cấu hình Nginx và HTTPS

Nếu tên miền của bạn không phải `newcoupon.com`, mở file `deploy/nginx.conf` và sửa dòng `server_name`. Sau đó:

```bash
cp deploy/nginx.conf /etc/nginx/sites-available/new-coupon && ln -sf /etc/nginx/sites-available/new-coupon /etc/nginx/sites-enabled/ && rm -f /etc/nginx/sites-enabled/default && nginx -t && systemctl reload nginx
```

Bật HTTPS miễn phí. Chỉ chạy khi DNS ở bước 2 đã trỏ đúng:

```bash
certbot --nginx -d newcoupon.com -d www.newcoupon.com
```

Giờ mở `https://newcoupon.com` để xem website. Trang quản trị nằm ở `https://newcoupon.com/admin`.

## 6. Tự động deploy mỗi khi push code (GitHub Actions)

1. Trên VPS, tạo một SSH key riêng cho việc deploy:

```bash
ssh-keygen -t ed25519 -f ~/.ssh/github_deploy -N "" && cat ~/.ssh/github_deploy.pub >> ~/.ssh/authorized_keys && cat ~/.ssh/github_deploy
```

2. Trên GitHub, vào repo → **Settings → Secrets and variables → Actions → New repository secret** và thêm các secret sau:

| Tên secret | Giá trị |
|------------|---------|
| `VPS_HOST` | IP của VPS |
| `VPS_USER` | `root` |
| `VPS_SSH_KEY` | toàn bộ nội dung private key vừa in ra, kể cả dòng `-----BEGIN…` và `-----END…` |
| `VPS_PORT` | `22` (có thể bỏ qua nếu dùng cổng mặc định) |

3. Vẫn trong **Settings → Secrets and variables → Actions**, chuyển sang tab **Variables** và tạo biến `DEPLOY_VPS` với giá trị `true`. Thiếu biến này thì GitHub chỉ kiểm tra code, không deploy lên VPS.

4. Từ giờ, mỗi lần `git push` lên `main`, GitHub sẽ tự kiểm tra code, build thử, rồi SSH vào VPS để chạy `deploy/deploy.sh` (pull code, cập nhật database, build, khởi động lại). Bạn theo dõi tiến trình ở tab **Actions** của repo.

Muốn deploy bằng tay thì chạy trên VPS:

```bash
bash /var/www/new-coupon/deploy/deploy.sh
```

---

## Vận hành hằng ngày

- **Xem log website:** `pm2 logs new-coupon`
- **Khởi động lại website:** `pm2 restart new-coupon`
- **Sao lưu database:**

```bash
sudo -u postgres pg_dump newcoupon > ~/backup-$(date +%F).sql
```

- **Sao lưu ảnh đã upload:** thư mục `/var/www/new-coupon-uploads`.

## Nhập dữ liệu thật

1. Đăng nhập `/admin` → **CSV import**.
2. Tải file mẫu `stores.csv`, điền danh sách cửa hàng và link affiliate, rồi import.
3. Tải file mẫu `coupons.csv`, điền danh sách coupon, rồi import.
4. Có thể upload logo cho từng cửa hàng trong **Stores → Edit**. Cửa hàng chưa có logo sẽ hiển thị ô chữ viết tắt.
