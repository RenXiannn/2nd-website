// Products data
const products = [
    // Diffusers (New Products)
    { id: 1, name: 'Modern Cylindrical Diffuser', price: 49.99, description: 'Sleek, modern design with a powerful, quiet mist.', image: 'modern_cylindrical_black.png' },
    { id: 2, name: 'Animal Cat Diffuser', price: 34.99, description: 'A cute, white cat-shaped diffuser for a playful touch.', image: 'animal_cat_white.png' },
    { id: 3, name: 'Animal Bear Diffuser', price: 34.99, description: 'A charming pink bear diffuser, perfect for a cozy atmosphere.', image: 'animal_bear_pink.png' },
    { id: 4, name: 'Teardrop Diffuser', price: 59.99, description: 'Elegant teardrop shape in a clean white finish.', image: 'teardrop_white.png' },
    { id: 5, name: 'Spherical Diffuser', price: 45.99, description: 'Minimalist spherical design with a warm ambient light.', image: 'spherical_white.png' },
    { id: 6, name: 'Plant Diffuser', price: 65.99, description: 'Unique plant-inspired design for a natural look.', image: 'plant_white.png' },
    { id: 7, name: 'Pyramid Diffuser', price: 55.99, description: 'Striking pyramid shape in a matte black finish.', image: 'pyramid_black.png' },
    { id: 8, name: 'Minimalist Humidifier', price: 39.99, description: 'Simple, square design for effective humidification.', image: 'minimalist_humidifier.jpg' },
    { id: 9, name: 'Mushroom Diffuser', price: 32.99, description: 'Cute mushroom shape with a smiling face and colorful light.', image: 'category_cute_playful_new_bg.png' }
];

// Key for localStorage
const CART_STORAGE_KEY = 'aquaAuraCart';

// Cart state: Load from localStorage or initialize as empty
let cart = JSON.parse(localStorage.getItem(CART_STORAGE_KEY)) || [];

// Utility function to save cart to localStorage
function saveCart() {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
}

// Utility function to load common elements (nav/footer)
function loadCommonElements() {
    // This function is a placeholder for a server-side include or a more complex SPA setup.
    // Since we are creating static HTML files, we will rely on the direct HTML structure
    // and the showPage function for navigation within the original single-page context.
    // For the separated files, we will link directly.
}

// Initialize
window.onload = function() {
    // Always update the cart count in the navigation bar on every page load
    updateCartCountInNav();

    // Only run display functions if the element exists on the current page
    if (document.getElementById('featuredProducts')) {
        displayFeaturedProducts();
    }
    if (document.getElementById('productsGrid')) {
        displayProducts();
    }
    if (document.getElementById('cartItems')) {
        // If we are on the cart page, update the full cart display
        updateCartDisplay();
    }
};

// Display products
function displayProducts() {
    const grid = document.getElementById('productsGrid');
    if (!grid) return;
    grid.innerHTML = products.map(product => {
        // Determine content for the product image/icon area
        let imageContent;
        if (product.image) {
            imageContent = `<img src="images/${product.image}" alt="${product.name}" style="width:100%;height:auto;">`;
        } else {
            imageContent = product.icon;
        }

        return `
            <div class="product-card">
                <div class="product-image">${imageContent}</div>
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p>${product.description}</p>
                    <div class="product-price">$${product.price.toFixed(2)}</div>
                    <button class="add-to-cart" onclick="addToCart(${product.id})">Add to Cart</button>
                </div>
            </div>
        `;
    }).join('');
}

// Display featured products (first 3)
function displayFeaturedProducts() {
    const featuredGrid = document.getElementById('featuredProducts');
    if (!featuredGrid) return;
    const featured = products.slice(0, 3); 
    featuredGrid.innerHTML = featured.map(product => `
        <div class="product-card">
            <div class="product-image"><img src="images/${product.image}" alt="${product.name}" style="width:100%;height:auto;"></div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <div class="product-price">$${product.price.toFixed(2)}</div>
                <button class="add-to-cart" onclick="addToCart(${product.id})">Add to Cart</button>
            </div>
        </div>
    `).join('');
}

// Add to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    
    saveCart(); // Save cart to localStorage after modification
    updateCartCountInNav(); // Update the count in the navigation bar
    showNotification('Added to cart!');
}

// Update only the cart count in the navigation bar
function updateCartCountInNav() {
    const cartCountElement = document.getElementById('cartCount');
    if (cartCountElement) {
        const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCountElement.textContent = cartCount;
    }
}

// Update full cart display (only used on cart.html)
function updateCartDisplay() {
    const cartItems = document.getElementById('cartItems');
    if (!cartItems) return; // Only run if on the cart page

    if (cart.length === 0) {
        cartItems.innerHTML = '<div class="empty-cart"><h3>Your cart is empty</h3><p>Add some products to get started!</p></div>';
    } else {
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-info">
                    <strong>${item.name}</strong>
                    <div>$${item.price.toFixed(2)} each</div>
                </div>
                <div class="cart-item-controls">
                    <div class="quantity-control">
                        <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                    </div>
                    <button class="remove-btn" onclick="removeFromCart(${item.id})">Remove</button>
                </div>
            </div>
        `).join('');
    }
    
    const totalElement = document.getElementById('cartTotal');
    if (totalElement) {
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        totalElement.textContent = total.toFixed(2);
    }
    
    // The cart count in the nav is updated by updateCartCountInNav, which is called in window.onload
}

// Update quantity
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            saveCart(); // Save after quantity change
            updateCartCountInNav(); // Update nav count
            updateCartDisplay(); // Update cart page display
        }
    }
}

// Remove from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart(); // Save after removal
    updateCartCountInNav(); // Update nav count
    updateCartDisplay(); // Update cart page display
}

// Checkout
function checkout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    alert('Thank you for shopping with us!');
    cart = [];
    localStorage.removeItem(CART_STORAGE_KEY); // Clear cart from storage
    updateCartCountInNav(); // Update nav count
    // In a multi-page setup, we'd redirect to the home page
    window.location.href = 'index.html';
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #8b7355;
        color: white;
        padding: 1rem 2rem;
        border-radius: 5px;
        z-index: 3000;
        animation: slideIn 0.3s ease;
    `;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 2000);
}

// Form submission
function handleSubmit(event) {
    event.preventDefault();
    alert('Thank you for your message! We will get back to you soon.');
    event.target.reset();
}
