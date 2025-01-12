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





