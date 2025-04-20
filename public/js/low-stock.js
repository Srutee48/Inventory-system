import { checkAuth, logout } from "./auth.js";

window.onload = checkAuth();
const logoutBtn = document.getElementById("logout-btn");
if (logoutBtn) {
    logoutBtn.addEventListener("click", logout);
}

async function fetchLowStockProducts() {
    try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:3000/api/products/low-stock", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (!response.ok) {
            throw new Error("Failed to fetch low stock products");
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching low stock products:", error);
        window.location.href = "index.html";
    }
}

async function displayLowStockProducts() {
    const products = await fetchLowStockProducts();
    const lowStockTable = document.getElementById("low-stock-table").getElementsByTagName("tbody")[0];

    products.forEach((product) => {
        const row = lowStockTable.insertRow();
        const nameCell = row.insertCell();
        const categoryCell = row.insertCell();
        const quantityCell = row.insertCell();
        const reorderLevelCell = row.insertCell();

        nameCell.textContent = product.name;
        categoryCell.textContent = product.category;
        quantityCell.textContent = product.quantity;
        reorderLevelCell.textContent = product.reorder_level;
    });
}

displayLowStockProducts();