// Cart — localStorage + shared UI helpers for the storefront

function escapeHtml(str) {
    const s = str == null ? '' : String(str);
    return s
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function getCart() {
    try {
        return JSON.parse(localStorage.getItem('cart')) || [];
    } catch {
        return [];
    }
}

function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartBadge();
}

function addToCart(id, name, price, image) {
    const cart = getCart();
    const existing = cart.find((item) => String(item.id) === String(id));
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ id, name, price, image, quantity: 1 });
    }
    saveCart(cart);

    if (typeof document === 'undefined') return;

    const wrap = document.createElement('div');
    wrap.className = 'position-fixed bottom-0 end-0 p-3 cart-toast-host';
    wrap.style.zIndex = '1050';
    const toast = document.createElement('div');
    toast.className = 'toast show text-white bg-success border-0';
    toast.setAttribute('role', 'alert');
    const body = document.createElement('div');
    body.className = 'toast-body fw-bold';
    body.textContent = 'Added "' + String(name) + '" to your cart';
    toast.appendChild(body);
    wrap.appendChild(toast);
    document.body.appendChild(wrap);
    setTimeout(() => wrap.remove(), 2500);
}

function removeCartItem(index) {
    const cart = getCart();
    if (index < 0 || index >= cart.length) return;
    cart.splice(index, 1);
    saveCart(cart);
}

function changeQuantity(index, delta) {
    const cart = getCart();
    if (!cart[index]) return;
    cart[index].quantity += delta;
    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }
    saveCart(cart);
}

function updateCartBadge() {
    if (typeof document === 'undefined') return;
    const count = getCart().reduce((sum, item) => sum + item.quantity, 0);
    document.querySelectorAll('.cart-badge').forEach((b) => {
        b.textContent = count > 0 ? String(count) : '';
    });
}

if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', updateCartBadge);
}

