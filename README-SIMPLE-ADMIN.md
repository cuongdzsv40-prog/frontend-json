# Hướng dẫn sử dụng Admin đơn giản

## Tổng quan
Đã thêm trang admin đơn giản để quản lý sản phẩm với các chức năng cơ bản.

## Tính năng Admin

### 1. Trang Admin (`admin.html`)
- **Thêm sản phẩm mới**: Click nút "➕ Thêm sản phẩm mới"
- **Sửa sản phẩm**: Click nút "✏️ Sửa" trên sản phẩm
- **Xóa sản phẩm**: Click nút "🗑️ Xóa" trên sản phẩm
- **Làm mới**: Click nút "🔄 Làm mới danh sách"

### 2. Truy cập Admin
- Từ trang chủ: Click nút "🔧 Admin" ở thanh navigation
- Từ trang sản phẩm: Click nút "🔧 Admin" ở thanh navigation
- Truy cập trực tiếp: Mở file `admin.html`

## Cách sử dụng

### 1. Chạy JSON Server
```bash
json-server --watch db.json --port 3000
```

### 2. Mở trang web
- Mở `index.html` trong trình duyệt
- Click nút "🔧 Admin" để vào trang quản lý

### 3. Quản lý sản phẩm
- **Thêm mới**: Click "➕ Thêm sản phẩm mới" → Điền form → Click "Lưu"
- **Sửa**: Click "✏️ Sửa" trên sản phẩm → Chỉnh sửa → Click "Lưu"
- **Xóa**: Click "🗑️ Xóa" trên sản phẩm → Xác nhận

## Cấu trúc file

```
ECMASCRIPT/bai2/
├── index.html          # Trang chủ (có link Admin)
├── product.html        # Trang sản phẩm (có link Admin)
├── admin.html          # Trang admin quản lý sản phẩm
├── main.js             # Logic chính
├── style.css           # CSS styling
└── db.json             # Dữ liệu sản phẩm
```

## Form thêm/sửa sản phẩm

### Thông tin bắt buộc:
- **Tên sản phẩm**: Tên hiển thị
- **Giá (VND)**: Giá bán (số dương)
- **Danh mục**: Laptop hoặc Điện thoại
- **URL hình ảnh**: Link ảnh sản phẩm

### Thông tin tùy chọn:
- **Mô tả**: Mô tả chi tiết sản phẩm
- **Sản phẩm nổi bật**: Checkbox để đánh dấu sản phẩm hot

## Lưu ý
- Dữ liệu được lưu trong `db.json`
- Cần chạy JSON Server để sử dụng
- Không cần đăng nhập, ai cũng có thể truy cập admin
- Thay đổi sẽ được lưu ngay lập tức
