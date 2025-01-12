let productData = [];

function truncatewords(str, numWords) {
    const words = str.split('');
    if (words.length <= numWords) {
        return str;
    }
    return words.slice(0, numWords).join('') + '...';
}

function normalizeCategory(category) {
    return category.toLowerCase().replace(/[^a-zA-Z0-9]+/g, '-');
}

fetch("https://fakestoreapi.com/products")
    .then((response) => response.json())
    .then((data) => {
        productData = data; 
        localStorage.setItem('productData', JSON.stringify(productData)); 

        const containersCards = productData.map((product) => {
            const truncateDescription = truncatewords(product.description, 60);
            const truncateTitle = truncatewords(product.title, 15);

            const normalizedCategory = normalizeCategory(product.category);

            return `
                <div class="product ${normalizedCategory}">
                    <div class="product-card2">
                        <img class="api-images" src="${product.image}" alt="${product.title}">
                        <h5 class="product-title">${truncateTitle}</h5>
                        <p class="product-description">${truncateDescription}</p>
                    </div>
                    
                    <p class="product-price">$${product.price}</p>
                    
                    <div >
                        <button class="details-button" onclick="showDetails(${product.id})">Details</button>
                        <button  class="add-to-cart-button" onclick='addToCart(${product.id})'>Add to Cart</button>
                    </div>
                </div>
            `;
        });

        const container = document.getElementById("productContainer");
        container.innerHTML = containersCards.join('');
    })
    .catch((error) => {
        console.log(error);
    });

function filteritems(category) {
    const items = document.querySelectorAll('.product');
    const normalizedCategory = normalizeCategory(category);

    items.forEach((item) => {
        const itemCategory = item.classList[1];
        if (category === 'all' || itemCategory === normalizedCategory) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}


function addToCart(productId) {
    const product = productData.find((p) => p.id === productId);
    if (!product) {
        console.error('Product not found for ID:', productId);
        return;
    }

    console.log('Product added to cart:', product);

    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Check if the product is already in the cart
    const existingProductIndex = cart.findIndex(item => item.id === product.id);

    if (existingProductIndex > -1) {
        // If product already exists in the cart, increase the quantity
        cart[existingProductIndex].quantity += 1;
    } else {
        // If the product doesn't exist, add it to the cart with quantity = 1
        product.quantity = 1;  // Set initial quantity to 1
        cart.push(product);
    }

    // Save the updated cart to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));

    // Update the cart count in the header (unique product count)
    updateCartCount();
}


function updateCartCount() {
    // Retrieve the cart from localStorage
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Count only the unique products (ignoring quantities)
    const uniqueProductCount = cart.length;

    // Update the cart icon with the total number of unique products
    const cartCountElement = document.querySelector('.cart-count');
    if (cartCountElement) {
        cartCountElement.textContent = `Cart(${uniqueProductCount})`;  // Update cart count
    }
}

document.addEventListener('DOMContentLoaded', updateCartCount);


// cart functionality
document.getElementById('cbtn')?.addEventListener('click', () => {
    window.location.href = "http://127.0.0.1:5500/html/index.html#";
});

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    console.log("Cart data:", cart); 
    const totalItemCount = cart.length; 
    const cartCountElement = document.querySelector('.cart-count');
    if (cartCountElement) {
        cartCountElement.textContent =` Cart(${totalItemCount})`; // Update cart count
    }
}

function calculateTotalAmount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
    const shippingCost = cart.length > 0 ? 30 : 0; 
    const totalAmount = totalPrice + shippingCost;

    document.querySelector('#total-price').innerText = $`{totalPrice.toFixed(2)}`;
    document.querySelector('.shipping .stwo').innerText = $`{shippingCost.toFixed(2)}`;
    document.querySelector('.amount .atwo').innerText = $`{totalAmount.toFixed(2)}`;
}

function loadCartItems() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    console.log("Cart loaded:", cart); 
    const container = document.querySelector('.container3');

    if (cart.length === 0) {
        container.innerHTML = `
            <br><br><br><br>
            <h1 class="empty">Your Cart is Empty</h1>
            <a href="http://127.0.0.1:5500/html/index.html#">
                <button class="button" id="cbtn">
                    <i class="fa-solid fa-arrow-left left"></i> Continue Shopping
                </button>
            </a>
            <br><br><br><br>
        `;
    } else {
        let cartItemsHTML = `
        <div class="fcart">
            <div class="cart-items">
                <span class="cart-top">Item List</span><br>
                <hr class="oline">
                ${cart.map((product, index) => `
                    <div class="cart-item">
                        <img src="${product.image}" alt="${product.title}" class="cart-item-image">
                        <h3>${product.title}</h3>
                        <div class="cart-item-details">
                            <button class="minus" data-index="${index}" onclick="updateQuantity(${index}, -1)">-</button>
                            <span id="quantity-${index}">${product.quantity || 1}</span>
                            <button class="plus" data-index="${index}" onclick="updateQuantity(${index}, 1)">+</button>
                            <p id="per-item-price-${index}" class="price">
                                ${product.quantity || 1} \u00D7 $${product.price.toFixed(2)}
                            </p>
                            <button class="remove btn btn-danger" onclick="removeFromCart(${index})">Remove</button>
                        </div>
                    </div>
                    <hr class="tline">
                `).join('')}
            </div>
            <div class="fcart2">
                <h3 class="summary">Order Summary</h3>
                <hr class="ooline">
                <div class="last">
                    <span class="lone" id="total-items">Products (${cart.reduce((sum, item) => sum + (item.quantity || 1), 0)})</span>
                    <span class="ltwo" id="total-price "> ${cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0)}</span>
                </div>
                <div class="shipping">
                    <span class="sone">Shipping</span>
                    <span class="stwo">$30</span>
                </div>
                <div class="amount">
                    <span class="aone">Total Amount</span>
                    <span class="atwo">${cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0)+30}</span>
                </div>
                <button class="check">Go To Checkout</button>
            </div>
        </div>
        `;
        container.innerHTML = cartItemsHTML;
    }

    calculateTotalAmount();
    updateCartCount(); 
}

function removeFromCart(index) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.splice(index, 1); 
    localStorage.setItem('cart', JSON.stringify(cart)); 
    loadCartItems(); 
    updateCartCount();
}

function updateQuantity(index, change) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (!cart[index].quantity) {
        cart[index].quantity = 1; 
    }

    cart[index].quantity += change;

    if (cart[index].quantity < 1) {
        cart.splice(index, 1); // Remove item if quantity is less than 1
    }

    localStorage.setItem('cart', JSON.stringify(cart)); 
    console.log("Cart after quantity update:", cart);
    loadCartItems(); 
}

// Event listener to load cart items when the page loads
document.addEventListener('DOMContentLoaded', () => {
    loadCartItems(); 
});

