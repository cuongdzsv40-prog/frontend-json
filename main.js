//Trang chủ hiển thị sản phẩm 
const productHot = document.getElementById('product-hot');
const productLaptop = document.getElementById('product-laptop');
const productDienThoai = document.getElementById('product-dienthoai');
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const sortSelect = document.getElementById('sort-select');

let allProducts = [];

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdefghijklmnopqrstuvwxyz"
};

// Initialize Firebase (will be loaded from CDN)
let auth = null;
let db = null;

function renderSections(products) {
    if (!productHot) return;
    const toHTML = (it) => new Product(
        it.id, it.name, it.price, it.image, it.category, it.hot, it.description, it.rating
    ).render();
    const render = (el, items) => { if (el) el.innerHTML = items.map(toHTML).join(""); };

    render(productHot, products.filter(p => p.hot === true));
    render(productLaptop, products.filter(p => p.category === "laptop"));
    render(productDienThoai, products.filter(p => p.category === "điện thoại"));

    // Cập nhật số lượng cart từ localStorage
    updateCartCount();
}

function getFilteredSortedProducts() {
    const q = (searchInput?.value || "").trim().toLowerCase();
    let list = allProducts.filter(p => !q || String(p.name).toLowerCase().includes(q));

    const sortValue = sortSelect?.value || "";
    if (sortValue === 'price-asc') {
        list = [...list].sort((a, b) => Number(a.price) - Number(b.price));
    } else if (sortValue === 'price-desc') {
        list = [...list].sort((a, b) => Number(b.price) - Number(a.price));
    }
    return list;
}

const updateUI = () => renderSections(getFilteredSortedProducts());

if (productHot) {
    loadProducts().then(() => {
            // gắn sự kiện tìm kiếm & sắp xếp
            searchButton?.addEventListener('click', updateUI);
            searchInput?.addEventListener('keydown', (e) => { if (e.key === 'Enter') updateUI(); });
            searchInput?.addEventListener('input', updateUI);
            sortSelect?.addEventListener('change', updateUI);
        });
}
class Product {
    constructor(id, name, price, image, category, hot, description, rating = 0) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.image = image;
        this.category = category;
        this.hot = hot;
        this.description = description;
        this.rating = Number(rating) || 0;
    }

    render() {
        return `
        <div class="product">
            ${this.hot ? `<div class="badge-hot">HOT</div>` : ""}
            <div class="product-img">
                <a href="detail.html?id=${this.id}" aria-label="Xem chi tiết ${this.name}">
                    <img src="${this.image}" alt="${this.name}">
                </a>
            </div>
            <div class="product-info">
                <h4><a class="product-link" href="detail.html?id=${this.id}">${this.name}</a></h4>
                <div class="rating" aria-label="Đánh giá: ${this.rating} trên 5 sao">
                  <div class="rating-bg">★★★★★</div>
                  <div class="rating-fill" style="width: ${(Math.max(0, Math.min(5, this.rating)) / 5) * 100}%">★★★★★</div>
                </div>
                <p class="price">${this.price.toLocaleString()} VND</p>
                <button class="buy-btn" 
                        data-id="${this.id}"
                        data-name="${this.name}"
                        data-price="${this.price}"
                        data-image="${this.image}">
                  Mua ngay
                </button>
                <a class="detail-btn" href="detail.html?id=${this.id}">Xem chi tiết</a>
            </div>
        </div>
        `;
    }
}

// ---------------- CART LOGIC ----------------
function getCart() {
    try {
        const raw = localStorage.getItem('cart');
        return raw ? JSON.parse(raw) : [];
    } catch (e) {
        console.error('Cannot parse cart from localStorage', e);
        return [];
    }
}

function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function updateCartCount() {
    const countEl = document.getElementById('cart-count');
    if (!countEl) return;
    const cart = getCart();
    const totalQty = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    countEl.textContent = totalQty;
}

function addToCart(item) {
    const cart = getCart();
    const idx = cart.findIndex(p => String(p.id) === String(item.id));
    if (idx >= 0) {
        cart[idx].quantity = (cart[idx].quantity || 1) + 1;
    } else {
        cart.push({ ...item, quantity: 1 });
    }
    saveCart(cart);
    updateCartCount();
}

// Event delegation: một listener cho toàn bộ nút Mua
document.addEventListener('click', (e) => {
    const btn = e.target.closest?.('.buy-btn[data-id]');
    if (!btn) return;
    const item = {
        id: btn.getAttribute('data-id'),
        name: btn.getAttribute('data-name'),
        price: Number(btn.getAttribute('data-price')),
        image: btn.getAttribute('data-image')
    };
    addToCart(item);
});

// Khởi tạo khi load trang (trường hợp đã có sẵn sản phẩm render)
document.addEventListener('DOMContentLoaded', updateCartCount);
// Trang chi tiết sản phẩm
document.addEventListener('DOMContentLoaded', () => {
    const detailContainer = document.getElementById('product-detail');
    if (!detailContainer) return;

    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    if (!id) {
        detailContainer.innerHTML = `<p>Không tìm thấy sản phẩm.</p>`;
        return;
    }

    const ensureProducts = () => {
        if (allProducts && allProducts.length) return Promise.resolve(allProducts);
        return fetch('http://localhost:3000/products').then(r => r.json()).then(d => Array.isArray(d) ? d : []);
    };

    ensureProducts().then(products => {
        const p = products.find(it => String(it.id) === String(id));
        if (!p) {
            detailContainer.innerHTML = `<p>Không tìm thấy sản phẩm.</p>`;
            return;
        }
        const rating = Number(p.rating) || 0;
        const ratingWidth = (Math.max(0, Math.min(5, rating)) / 5) * 100;
        document.getElementById('breadcrumb-current')?.replaceChildren(document.createTextNode(p.name));
        detailContainer.innerHTML = `
          <section class="detail">
            <div class="detail-gallery">
              <img src="${p.image}" alt="${p.name}">
            </div>
            <div class="detail-info">
              <h1 class="detail-title">${p.name}</h1>
              <div class="rating" aria-label="Đánh giá: ${rating} trên 5 sao">
                <div class="rating-bg">★★★★★</div>
                <div class="rating-fill" style="width: ${ratingWidth}%">★★★★★</div>
              </div>
              <p class="detail-price">${Number(p.price).toLocaleString()} VND</p>
              <p class="detail-desc">${p.description || 'Sản phẩm chất lượng cao.'}</p>
              <div class="detail-actions">
                <button class="buy-btn" 
                        data-id="${p.id}"
                        data-name="${p.name}"
                        data-price="${p.price}"
                        data-image="${p.image}">Thêm vào giỏ</button>
                <a class="back-link" href="product.html">← Quay lại danh sách</a>
              </div>
            </div>
          </section>
        `;
        updateCartCount();
    }).catch(() => {
        detailContainer.innerHTML = `<p>Không tải được dữ liệu sản phẩm.</p>`;
    });
});
// tao header & footer (chi chen khi trang chua co)
if (!document.querySelector('.navbar')) {
    const header = document.createElement('header');
    header.className = 'navbar';
    header.innerHTML = `
      <a href="index.html" class="logo">📱 Laptop & Phone Store</a>
      <div class="search-box">
        <input id="search-input" type="text" placeholder="Tìm sản phẩm...">
        <button id="search-button">Tìm</button>
      </div>
      <div class="auth" id="auth-section">
        <a href="index.html" class="btn">Trang chủ</a>
        <a href="admin.html" class="btn" style="background: var(--gradient-primary); color: white;">🔧 Admin</a>
        <a href="product.html" class="btn">Sản phẩm</a>
        <a href="../lab8/login.html" class="btn">Đăng nhập</a>
        <a href="../lab8/register.html" class="btn">Đăng ký</a>
        <a href="#" class="cart-btn" id="cart-button" aria-label="Giỏ hàng">
          🛒 <span>Giỏ hàng</span>
          <span class="cart-count" id="cart-count">0</span>
        </a>
      </div>`;
    document.body.prepend(header);
}

if (!document.querySelector('footer')) {
    const footer = document.createElement('footer');
    footer.innerHTML = `
      <div class="footer-container">
        <div class="footer-about">
          <h3>📱 Laptop & Phone Store</h3>
          <p>Cửa hàng chuyên cung cấp điện thoại và laptop chính hãng, giá tốt.</p>
        </div>
        <div class="footer-links">
          <h4>Liên kết nhanh</h4>
          <ul>
            <li><a href="index.html">Trang chủ</a></li>
            <li><a href="product.html">Sản phẩm</a></li>
            <li><a href="#">Giỏ hàng</a></li>
            <li><a href="#">Liên hệ</a></li>
          </ul>
        </div>
        <div class="footer-contact">
          <h4>Liên hệ</h4>
          <p>📞 0123 456 789</p>
          <p>📧 contact@store.com</p>
          <p>🏠 123 Đường ABC, Hà Nội</p>
        </div>
      </div>
      <div class="footer-bottom">
        <p>© 2025 Laptop & Phone Store. All rights reserved.</p>
      </div>
    `;
    document.body.appendChild(footer);
}
//giỏ hàng
class Cart{
    constructor(){
        this.items=[];
    }
}

// ---------------- CART UI (drawer) + CRUD ----------------
// Tạo UI giỏ hàng (drawer) nếu chưa có
(function ensureCartDrawer() {
    if (document.getElementById('cart-drawer')) return;
    const drawer = document.createElement('div');
    drawer.id = 'cart-drawer';
    drawer.setAttribute('aria-hidden', 'true');
    drawer.innerHTML = `
      <div class="cart-overlay" data-cart-close></div>
      <aside class="cart-panel">
        <header class="cart-header">
          <h3>Giỏ hàng</h3>
          <button class="cart-close" data-cart-close aria-label="Đóng">✕</button>
        </header>
        <div class="cart-body" id="cart-items"></div>
        <footer class="cart-footer">
          <div class="cart-summary">
            <span>Tổng số lượng: <strong id="cart-total-qty">0</strong></span>
            <span>Tổng tiền: <strong id="cart-total-price">0 VND</strong></span>
          </div>
          <div class="cart-actions">
            <button id="cart-clear" class="btn danger">Xoá tất cả</button>
            <a href="#" class="btn primary" id="cart-checkout">Thanh toán</a>
          </div>
        </footer>
      </aside>`;
    document.body.appendChild(drawer);
})();

function renderCart() {
    const itemsContainer = document.getElementById('cart-items');
    if (!itemsContainer) return;
    const cart = getCart();
    if (!cart.length) {
        itemsContainer.innerHTML = `<p class="empty">Giỏ hàng trống.</p>`;
    } else {
        itemsContainer.innerHTML = cart.map(item => `
          <div class="cart-item" data-id="${item.id}">
            <img class="ci-img" src="${item.image}" alt="${item.name}">
            <div class="ci-info">
              <div class="ci-name">${item.name}</div>
              <div class="ci-price">${Number(item.price).toLocaleString()} VND</div>
              <div class="ci-qty">
                <button class="qty-btn" data-action="dec">-</button>
                <input class="qty-input" type="number" min="1" value="${item.quantity || 1}">
                <button class="qty-btn" data-action="inc">+</button>
              </div>
            </div>
            <button class="ci-remove" data-action="remove" aria-label="Xoá">✕</button>
          </div>
        `).join('');
    }
    // Cập nhật tổng
    const totalQty = cart.reduce((s, it) => s + (it.quantity || 1), 0);
    const totalPrice = cart.reduce((s, it) => s + Number(it.price) * (it.quantity || 1), 0);
    const qtyEl = document.getElementById('cart-total-qty');
    const priceEl = document.getElementById('cart-total-price');
    if (qtyEl) qtyEl.textContent = String(totalQty);
    if (priceEl) priceEl.textContent = `${totalPrice.toLocaleString()} VND`;
    updateCartCount();
}

function openCart() {
    const drawer = document.getElementById('cart-drawer');
    if (!drawer) return;
    drawer.classList.add('open');
    drawer.setAttribute('aria-hidden', 'false');
    renderCart();
}

function closeCart() {
    const drawer = document.getElementById('cart-drawer');
    if (!drawer) return;
    drawer.classList.remove('open');
    drawer.setAttribute('aria-hidden', 'true');
}

function updateItemQuantity(id, quantity) {
    const q = Math.max(1, Number(quantity) || 1);
    const cart = getCart();
    const idx = cart.findIndex(it => String(it.id) === String(id));
    if (idx >= 0) {
        cart[idx].quantity = q;
        saveCart(cart);
        renderCart();
    }
}

function removeItem(id) {
    const cart = getCart().filter(it => String(it.id) !== String(id));
    saveCart(cart);
    renderCart();
}

function clearCart() {
    saveCart([]);
    renderCart();
}

// Mở/đóng giỏ hàng từ nút trong header
document.addEventListener('click', (e) => {
    const openBtn = e.target.closest?.('#cart-button, .cart-btn');
    if (openBtn) {
        e.preventDefault();
        window.location.href = 'cart.html';
        return;
    }
    const closeBtn = e.target.closest?.('[data-cart-close]');
    if (closeBtn) {
        e.preventDefault();
        closeCart();
    }
});

// Lắng nghe hành vi trong giỏ hàng (drawer hoặc trang cart.html)
document.addEventListener('click', (e) => {
    const removeBtn = e.target.closest?.('.ci-remove[data-action="remove"]');
    if (removeBtn) {
        const id = removeBtn.closest('.cart-item')?.getAttribute('data-id');
        if (id) removeItem(id);
        return;
    }

    const qtyBtn = e.target.closest?.('.qty-btn');
    if (qtyBtn) {
        const itemEl = qtyBtn.closest('.cart-item');
        const id = itemEl?.getAttribute('data-id');
        const input = itemEl?.querySelector('.qty-input');
        if (id && input) {
            const cur = Math.max(1, Number(input.value) || 1);
            const action = qtyBtn.getAttribute('data-action');
            const next = action === 'inc' ? cur + 1 : Math.max(1, cur - 1);
            updateItemQuantity(id, next);
        }
        return;
    }

    const clearBtn = e.target.closest?.('#cart-clear');
    if (clearBtn) {
        clearCart();
        return;
    }
});

// Thay đổi trực tiếp input số lượng
document.addEventListener('change', (e) => {
    const input = e.target.closest?.('.qty-input');
    if (!input) return;
    const itemEl = input.closest('.cart-item');
    const id = itemEl?.getAttribute('data-id');
    if (id) updateItemQuantity(id, input.value);
});

// Đồng bộ UI khi load trang
document.addEventListener('DOMContentLoaded', () => {
    renderCart();
    updateAuthNavigation();
});

// ---------------- AUTHENTICATION INTEGRATION ----------------
// Check authentication status
function checkAuthStatus() {
    const userInfo = localStorage.getItem('currentUser');
    if (userInfo) {
        try {
            return JSON.parse(userInfo);
        } catch (error) {
            localStorage.removeItem('currentUser');
            return null;
        }
    }
    return null;
}

// Update user role based on email
function updateUserRole(user) {
    const userInfo = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        role: isAdminUser ? isAdminUser(user.email) : (user.email === 'admin@store.com' ? 'admin' : 'customer')
    };
    
    localStorage.setItem('currentUser', JSON.stringify(userInfo));
    return userInfo;
}

// Update navigation based on authentication
function updateAuthNavigation() {
    const user = checkAuthStatus();
    const authSection = document.getElementById('auth-section');
    
    if (!authSection) return;
    
    if (user) {
        authSection.innerHTML = `
            <a href="index.html" class="btn">Trang chủ</a>
            <a href="product.html" class="btn">Sản phẩm</a>
            <span class="btn" style="background: var(--gradient-primary); color: white;">
                👤 ${user.displayName || user.email}
            </span>
            <a href="#" class="btn" onclick="logout()">Đăng xuất</a>
            <a href="#" class="cart-btn" id="cart-button" aria-label="Giỏ hàng">
                🛒 <span>Giỏ hàng</span>
                <span class="cart-count" id="cart-count">0</span>
            </a>
        `;
    } else {
        authSection.innerHTML = `
            <a href="index.html" class="btn">Trang chủ</a>
            <a href="product.html" class="btn">Sản phẩm</a>
            <a href="../lab8/login.html" class="btn">Đăng nhập</a>
            <a href="../lab8/register.html" class="btn">Đăng ký</a>
            <a href="#" class="cart-btn" id="cart-button" aria-label="Giỏ hàng">
                🛒 <span>Giỏ hàng</span>
                <span class="cart-count" id="cart-count">0</span>
            </a>
        `;
    }
    
    // Show/hide admin panel
    toggleAdminPanel();
}

// Logout function
function logout() {
    if (confirm('Bạn có chắc chắn muốn đăng xuất?')) {
        localStorage.removeItem('currentUser');
        updateAuthNavigation();
        showNotification('Đã đăng xuất thành công!', 'success');
    }
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 600;
        z-index: 1001;
        box-shadow: var(--shadow-lg);
        background: ${type === 'success' ? 'linear-gradient(135deg, #10b981, #059669)' : 
                    type === 'error' ? 'linear-gradient(135deg, #ef4444, #dc2626)' : 
                    'linear-gradient(135deg, #3b82f6, #1d4ed8)'};
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}


// Load products function (update existing)
async function loadProducts() {
    try {
        const response = await fetch('http://localhost:3000/products');
        if (!response.ok) throw new Error('Không thể tải dữ liệu');
        
        allProducts = await response.json();
        renderSections(allProducts);
    } catch (error) {
        console.error('Lỗi tải sản phẩm:', error);
        showNotification('Không thể tải danh sách sản phẩm', 'error');
    }
}


// Make functions globally available
window.logout = logout;
window.updateAuthNavigation = updateAuthNavigation;