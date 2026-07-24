# BlockSite

Chrome extension (Manifest V3) chặn các domain gây xao nhãng. Nhập tên, bật/tắt,
quản lý danh sách domain. Khi cố vào một domain bị chặn, extension redirect sang
trang nhắc nhở với ảnh nền ngẫu nhiên.

## Tech stack

Vite + React + TypeScript + Tailwind v4. Build ra `dist/` rồi load unpacked.

## Cài đặt & build

```bash
npm install
npm run build
```

## Load extension (developer mode)

1. Mở `chrome://extensions`
2. Bật **Developer mode** (góc trên phải)
3. Bấm **Load unpacked**
4. Chọn thư mục `dist/`

Sau khi sửa code, chạy lại `npm run build` rồi bấm nút **Reload** trên thẻ extension.

## Cách dùng

- Bấm icon extension để mở popup.
- Nhập **tên** (dùng trong câu nhắc nhở).
- Công tắc bật/tắt tổng (tắt = không chặn gì).
- Thêm domain (ví dụ `facebook.com`) → chặn luôn cả `www.`, `m.`...
- Bấm `✕` để bỏ chặn một domain.

### URL ngoại lệ

Chặn cả domain nhưng vẫn cần vào vài link cụ thể (ví dụ Messenger cho công
việc) thì dán URL vào ô **Thêm URL ngoại lệ**.

- Khớp theo **tiền tố**: thêm `facebook.com/messages` là mở khoá mọi cuộc trò
  chuyện bên dưới; thêm nguyên link `facebook.com/messages/e2ee/t/8676347599136034`
  thì chỉ mở đúng cuộc trò chuyện đó.
- Tự bỏ `https://` và `www.`, khớp luôn subdomain — nên `facebook.com/messages`
  cũng ăn `www.facebook.com/messages`.
- Ngoại lệ luôn thắng rule chặn (priority cao hơn).

Lưu ý: Facebook là SPA nên sau khi vào được link ngoại lệ, bấm chuyển trang bên
trong app sẽ không tạo request mới → không bị chặn. Chỉ khi load lại nguyên
trang ở URL ngoài phạm vi ngoại lệ mới bị chặn.

## Thêm ảnh nền cho trang chặn

1. Thả ảnh vào `public/backgrounds/` (ví dụ `bg-1.jpg`).
2. Liệt kê tên file trong `src/shared/constants/backgrounds.ts`:
   ```ts
   export const BACKGROUND_IMAGES: string[] = ["bg-1.jpg", "bg-2.jpg"];
   ```
3. `npm run build` lại. Trang chặn sẽ chọn ngẫu nhiên 1 ảnh; danh sách rỗng thì
   dùng nền tối mặc định.

## Cấu trúc

```
src/
├── background/        # service worker: dựng declarativeNetRequest rules từ config
├── popup/             # UI popup (nhập tên, toggle, quản lý domain)
├── blocked/           # trang hiển thị khi bị chặn
└── shared/            # types, constants, utils, components dùng chung
```
