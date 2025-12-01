// Дані товарів (Варіант: Телевізори)
const products = [
    { id: 1, name: "Samsung 43' 4K Smart TV", price: 12000, img: "https://scdn.comfy.ua/89fc351a-22e7-41ee-8321-f8a9356ca351/https://cdn.comfy.ua/media/catalog/product/u/e/ue75u8000fuxua.jpg/w_600" },
    { id: 2, name: "LG 55' OLED", price: 35000, img: "https://scdn.comfy.ua/89fc351a-22e7-41ee-8321-f8a9356ca351/https://cdn.comfy.ua/media/catalog/product/1/_/1_lg_50qned70a6a.jpg/w_600" },
    { id: 3, name: "Sony Bravia 50'", price: 22500, img: "https://files.foxtrot.com.ua/PhotoNew/1_638259656002279010.webp" },
    { id: 4, name: "Philips Ambilight 43'", price: 15000, img: "https://4k-online.com.ua/51073-large_default/televizor-43-dyujmi-philips-43pus834912-4k-smart-tv-bluetooth-ambilight-w24-gv6453.jpg" }
];

// Змінна для збереження вибраного товару перед додаванням
let currentProductId = null;

// Ініціалізація при завантаженні сторінки
document.addEventListener('DOMContentLoaded', () => {
    // Перевіряємо, на якій ми сторінці
    if (document.getElementById('products-container')) {
        renderProducts();
        updateCartIcon();
    } else if (document.getElementById('cart-container')) {
        renderCart();
    }
});

// --- Функції для головної сторінки ---

function renderProducts() {
    const container = document.getElementById('products-container');
    container.innerHTML = products.map(p => `
        <div class="product-card">
            <img src="${p.img}" alt="${p.name}" class="product-img">
            <h3>${p.name}</h3>
            <div class="price">${p.price} грн</div>
            <button onclick="openQuantityModal(${p.id})">У КОРЗИНУ</button>
        </div>
    `).join('');
}

function openQuantityModal(id) {
    currentProductId = id;
    document.getElementById('qty-input').value = 1;
    document.getElementById('modal-quantity').style.display = 'flex';
}

function confirmAddToCart() {
    const qty = parseInt(document.getElementById('qty-input').value);
    if (qty > 0 && currentProductId) {
        addToCart(currentProductId, qty);
        closeModal('modal-quantity');
        document.getElementById('modal-success').style.display = 'flex';
    }
}

function addToCart(id, quantity) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Перевіряємо, чи є вже такий товар
    const existingItem = cart.find(item => item.id === id);
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        const product = products.find(p => p.id === id);
        cart.push({ ...product, quantity: quantity });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartIcon();
}

function updateCartIcon() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    // Завдання 5: Кількість найменувань, а не загальна сума штук 
    document.getElementById('cart-count').innerText = cart.length;
}

function checkCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (cart.length === 0) {
        document.getElementById('modal-empty').style.display = 'flex';
    } else {
        window.location.href = 'cart.html';
    }
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// --- Функції для сторінки корзини ---

function renderCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const container = document.getElementById('cart-container');
    
    if (cart.length === 0) {
        container.innerHTML = '<p style="text-align:center; padding:20px;">Корзина пуста</p>';
        document.getElementById('total-price').innerText = '0';
        return;
    }

    let html = `
        <table>
            <thead>
                <tr>
                    <th>№</th>
                    <th>Назва товару</th>
                    <th>Ціна за од.</th>
                    <th>К-сть</th>
                    <th>Сума</th>
                    <th>Дія</th>
                </tr>
            </thead>
            <tbody>
    `;

    let total = 0;

    cart.forEach((item, index) => {
        const sum = item.price * item.quantity;
        total += sum;
        html += `
            <tr>
                <td>${index + 1}</td>
                <td>${item.name}</td>
                <td>${item.price} грн</td>
                <td>
                    <input type="number" min="1" value="${item.quantity}" 
                           onchange="updateQuantity(${item.id}, this.value)">
                </td>
                <td>${sum} грн</td>
                <td><button class="delete-btn" onclick="removeFromCart(${item.id})">Видалити</button></td>
            </tr>
        `;
    });

    html += '</tbody></table>';
    container.innerHTML = html;
    document.getElementById('total-price').innerText = total;
}

function updateQuantity(id, newQty) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const item = cart.find(i => i.id === id);
    if (item) {
        item.quantity = parseInt(newQty);
        if (item.quantity < 1) item.quantity = 1;
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCart(); // Перемальовуємо таблицю
    }
}

function removeFromCart(id) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.filter(item => item.id !== id);
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
}