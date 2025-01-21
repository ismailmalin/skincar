// Initialize cart
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Render cart on checkout.html
function renderCart() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    const whatsappButton = document.getElementById('whatsapp-contact');

    cartItemsContainer.innerHTML = '';
    let total = 0;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<tr><td colspan="5" class="empty-cart">Your cart is empty.</td></tr>';
        whatsappButton.disabled = true;
        cartTotal.textContent = `$0.00`;
        return;
    }

    cart.forEach((item, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.name}</td>
            <td>$${item.price}</td>
            <td>${item.quantity}</td>
            <td>$${(item.price * item.quantity).toFixed(2)}</td>
            <td><button onclick="removeFromCart(${index})">Remove</button></td>
        `;
        cartItemsContainer.appendChild(row);
        total += item.price * item.quantity;
    });

    cartTotal.textContent = `$${total.toFixed(2)}`;
    whatsappButton.disabled = false;
}

// Remove item from cart
function removeFromCart(index) {
    cart.splice(index, 1);
    saveCart();
    renderCart();
}

// Add to cart (triggered on products.html)
function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ name, price: parseFloat(price), quantity: 1 });
    }

    saveCart();
    alert(`${name} added to cart.`);
}

// Handle WhatsApp message
document.getElementById('whatsapp-contact')?.addEventListener('click', () => {
    if (cart.length === 0) return;

    const phoneNumber = "617512504"; // Replace with your WhatsApp number
    let message = "Hello, I want to order the following:\n\n";

    cart.forEach(item => {
        message += `${item.quantity} x ${item.name} ($${item.price})\n`;
    });

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    message += `\nTotal: $${total.toFixed(2)}`;

    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
});

// On products.html, listen for add-to-cart clicks
document.querySelectorAll('.add-to-cart')?.forEach(button => {
    button.addEventListener('click', () => {
        const name = button.getAttribute('data-name');
        const price = button.getAttribute('data-price');
        addToCart(name, price);
    });
});

// Render cart if on checkout.html
if (window.location.pathname.includes('checkout.html')) {
    renderCart();
}
