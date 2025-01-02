
async function fetchData() {
    const apiUrl = "https://fakestoreapi.com/products"; 
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        localStorage.setItem("products", JSON.stringify(data)); 
        displayProducts(data); 
    } catch (error) {
        console.error("Error fetching data:", error);
        alert("Takes more time then usual to load products. Please refresh the page.");
    }
}
// Function to truncate text to a specified length
function truncateText(text, length) {
    if (text.length > length) {
        return text.substring(0, length) + '...'; 
    }
    return text;
}
// Display products based on the selected category
function displayProducts(products) {
    const container = document.getElementById("productContainer");
    container.innerHTML = ""; 
    products.forEach((product) => {
        const productDiv = document.createElement("div");
        productDiv.classList.add("product");
        productDiv.innerHTML = `
            <img class="api-images" src="${product.image}" alt="${product.title}">
             <h5>${truncateText(product.title, 12)}</h5> 
             <p>${truncateText(product.description, 90)}</p> 
            <h5 class="product-price">$  ${product.price}</h5>
            <button class="details-button" data-id="${product.id}">Details</button>
            <button class="add-to-cart-button" data-id="${product.id}">Add to Cart</button>
        `;
        container.appendChild(productDiv);
    });
}
// Filter products by category
function filterProducts(category) {
    const allProducts = JSON.parse(localStorage.getItem("products")) || [];
    if (category === "all") {
        displayProducts(allProducts);
    } else {
        const filteredProducts = allProducts.filter(
            (product) => product.category.toLowerCase() === category.toLowerCase()
        );
        displayProducts(filteredProducts);
    }
}
// Add event listeners to buttons
document.querySelectorAll(".buttons button").forEach((button) => {
    button.addEventListener("click", () => {
        const category = button.getAttribute("data-category");
        filterProducts(category);
    });
});
// Fetch data on page load and display all products
window.onload = async () => {
    await fetchData(); 
    const allProducts = JSON.parse(localStorage.getItem("products")) || [];
    displayProducts(allProducts); 
};
// change the color when the nav links is clicked
document.querySelectorAll('.nav-links').forEach(link => {
    link.addEventListener('click', function(event) {
        document.querySelectorAll('.nav-links').forEach(link => {
            link.classList.remove('active-link');
        });
        this.classList.add('active-link');
    });
});

           
