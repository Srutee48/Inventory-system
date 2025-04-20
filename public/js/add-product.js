import { checkAuth, logout } from "./auth.js";

window.onload = checkAuth();
const logoutBtn = document.getElementById("logout-btn");
if (logoutBtn) {
    logoutBtn.addEventListener("click", logout);
}

const addProductForm = document.getElementById("add-product-form");
const messageContainer = document.getElementById("add-product-message");

addProductForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const name = addProductForm.name.value;
    const category = addProductForm.category.value;
    const quantity = parseInt(addProductForm.quantity.value);
    const price = parseFloat(addProductForm.price.value);
    const reorder_level = parseInt(addProductForm.reorder_level.value);

    if (!name || !category || isNaN(quantity) || isNaN(price) || isNaN(reorder_level)) {
        messageContainer.textContent = "Please fill in all fields with valid values.";
        messageContainer.className = "error-message";
        return;
    }

    try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:3000/api/products", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ name, quantity, price, category, reorder_level }),
        });

        const data = await response.json();

        if (response.ok) {
            messageContainer.textContent = "Product added successfully!";
            messageContainer.className = "success-message";
            addProductForm.reset();
            setTimeout(() => {
                window.location.href = "products.html";
            }, 2000);
        } else {
            messageContainer.textContent = data.message || "Failed to add product";
            messageContainer.className = "error-message";
        }
    } catch (error) {
        console.error("Error:", error);
        messageContainer.textContent = "An error occurred. Please try again.";
        messageContainer.className = "error-message";
    }
});