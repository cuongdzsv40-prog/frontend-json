# ECMAScript Labs - Laptop & Phone Store

## Tổng quan
Dự án cửa hàng điện thoại và laptop với các tính năng quản lý sản phẩm và xác thực người dùng.

## Cấu trúc dự án

```
ECMAScript/
├── bai2/                    # Ứng dụng chính
│   ├── index.html          # Trang chủ
│   ├── product.html        # Danh sách sản phẩm
│   ├── detail.html         # Chi tiết sản phẩm
│   ├── cart.html           # Giỏ hàng
│   ├── main.js             # Logic chính
│   ├── style.css           # CSS
│   └── img/                # Hình ảnh sản phẩm
├── lab7/                   # LAB7: Admin Panel
│   ├── admin.html          # Trang quản trị
│   └── admin.js            # Logic admin
├── lab8/                   # LAB8: Firebase Auth
│   ├── login.html          # Đăng nhập
│   ├── register.html       # Đăng ký
│   ├── auth.js            # Logic authentication
│   ├── firebase-config.js  # Cấu hình Firebase
│   └── README.md           # Hướng dẫn Firebase
└── README.md               # File này
```

## LAB7: Admin Panel

### Tính năng
- ✅ **Thêm sản phẩm mới**: Form nhập thông tin sản phẩm
- ✅ **Sửa sản phẩm**: Chỉnh sửa thông tin sản phẩm có sẵn
- ✅ **Xóa sản phẩm**: Xóa sản phẩm với xác nhận
- ✅ **Quản lý danh sách**: Hiển thị bảng sản phẩm với pagination
- ✅ **Validation**: Kiểm tra dữ liệu đầu vào
- ✅ **Responsive**: Giao diện thân thiện mobile

### Cách sử dụng
1. Truy cập `lab7/admin.html`
2. Đăng nhập với tài khoản admin
3. Sử dụng các nút "Thêm", "Sửa", "Xóa" để quản lý

### API Endpoints
- `GET /products` - Lấy danh sách sản phẩm
- `POST /products` - Thêm sản phẩm mới
- `PUT /products/:id` - Cập nhật sản phẩm
- `DELETE /products/:id` - Xóa sản phẩm

## LAB8: Firebase Authentication

### Tính năng
- ✅ **Đăng ký**: Tạo tài khoản mới với email/password
- ✅ **Đăng nhập**: Xác thực người dùng
- ✅ **Google Sign-in**: Đăng nhập/đăng ký với Google
- ✅ **Quên mật khẩu**: Reset password qua email
- ✅ **Validation**: Kiểm tra form input
- ✅ **Session Management**: Quản lý phiên đăng nhập

### Cài đặt Firebase

#### 1. Tạo Firebase Project
```bash
# Truy cập https://console.firebase.google.com/
# Tạo project mới
# Thêm web app
```

#### 2. Cấu hình Authentication
```javascript
// Trong Firebase Console:
// Authentication > Sign-in method
// Enable Email/Password
// Enable Google sign-in
```

#### 3. Cập nhật Config
```javascript
// lab8/firebase-config.js
export const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};
```

## Tích hợp

### Authentication với Main App
```javascript
// Trong main.js đã được tích hợp:
// - Kiểm tra trạng thái đăng nhập
// - Cập nhật navigation
// - Quản lý session
```

### Admin Access Control
```javascript
// Kiểm tra quyền admin
const user = checkAuthStatus();
if (user && user.role === 'admin') {
    // Hiển thị link Admin
}
```

## Chạy dự án

### 1. Backend (JSON Server)
```bash
# Cài đặt json-server
npm install -g json-server

# Chạy server
json-server --watch db.json --port 3000
```

### 2. Frontend
```bash
# Mở file HTML trong browser
# Hoặc sử dụng live server
npx live-server
```

### 3. Firebase Setup
```bash
# 1. Tạo Firebase project
# 2. Cấu hình Authentication
# 3. Cập nhật firebase-config.js
# 4. Test đăng nhập/đăng ký
```

## Demo Flow

### 1. Trang chủ (bai2/index.html)
- Xem sản phẩm nổi bật
- Tìm kiếm và lọc sản phẩm
- Thêm vào giỏ hàng

### 2. Đăng ký/Đăng nhập (lab8/)
- Tạo tài khoản mới
- Đăng nhập với email/password
- Hoặc đăng nhập với Google

### 3. Admin Panel (lab7/admin.html)
- Quản lý sản phẩm
- Thêm/sửa/xóa sản phẩm
- Xem thống kê

## Troubleshooting

### Lỗi thường gặp:

1. **"Cannot fetch products"**
   - Kiểm tra json-server đang chạy
   - Verify URL: http://localhost:3000/products

2. **"Firebase not initialized"**
   - Kiểm tra firebase-config.js
   - Verify API keys

3. **"Admin access denied"**
   - Kiểm tra user.role === 'admin'
   - Verify localStorage có user info

## Công nghệ sử dụng

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: JSON Server (REST API)
- **Authentication**: Firebase Auth
- **Storage**: LocalStorage, Firebase
- **UI/UX**: Responsive Design, Modern CSS

## Tính năng nâng cao

### Có thể mở rộng:
- [ ] Real-time updates với Firebase
- [ ] Push notifications
- [ ] Payment integration
- [ ] Advanced admin analytics
- [ ] User roles & permissions
- [ ] Product reviews & ratings
- [ ] Order management
- [ ] Inventory tracking

## Liên hệ

Nếu có vấn đề hoặc cần hỗ trợ, vui lòng tạo issue hoặc liên hệ qua email.


