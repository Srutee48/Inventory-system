// public/sales.js
import { checkAuth, logout } from "./auth.js";

window.onload = checkAuth();
const logoutBtn = document.getElementById("logout-btn");
if (logoutBtn) {
    logoutBtn.addEventListener("click", logout);
}

async function fetchData(url) {
    try {
        const token = localStorage.getItem("token");
        const response = await fetch(url, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Failed to fetch data:", error);
        window.location.href = "login.html";
    }
}

async function displaySales() {
    const sales = await fetchData("http://localhost:3000/api/sales");
    const products = await fetchData("http://localhost:3000/api/products");
    const users = await fetchData("http://localhost:3000/api/auth/users");

    const productFilter = document.getElementById("product-filter");
    const userFilter = document.getElementById("user-filter");
    const salesTable = document.getElementById("sales-table").getElementsByTagName("tbody")[0];

    products.forEach((product) => {
        const option = document.createElement("option");
        option.value = product.id;
        option.textContent = product.name;
        productFilter.appendChild(option);
    });

    users.forEach((user) => {
        const option = document.createElement("option");
        option.value = user.id;
        option.textContent = user.username;
        userFilter.appendChild(option);
    });

    function populateSalesTable(salesData) {
        salesTable.innerHTML = "";
        salesData.forEach((sale) => {
            const row = salesTable.insertRow();
            row.insertCell().textContent = sale.id;
            row.insertCell().textContent = sale.product.name;
            row.insertCell().textContent = sale.quantity;
            row.insertCell().textContent = `$${sale.totalPrice.toFixed(2)}`;
            row.insertCell().textContent = new Date(sale.saleDate).toLocaleDateString();
            row.insertCell().textContent = sale.user.username;
        });
    }

    populateSalesTable(sales);

    document.getElementById("search-input").addEventListener("input", (event) => {
        const searchTerm = event.target.value.toLowerCase();
        const filteredSales = sales.filter((sale) => {
            return (
                sale.product.name.toLowerCase().includes(searchTerm) ||
                sale.user.username.toLowerCase().includes(searchTerm) ||
                sale.id.toString().includes(searchTerm)
            );
        });
        populateSalesTable(filteredSales);
    });

    productFilter.addEventListener("change", (event) => {
        const selectedProductId = parseInt(event.target.value);
        if (selectedProductId) {
            const filteredSales = sales.filter((sale) => sale.productId === selectedProductId);
            populateSalesTable(filteredSales);
        } else {
            populateSalesTable(sales);
        }
    });

    userFilter.addEventListener("change", (event) => {
        const selectedUserId = parseInt(event.target.value);
        if (selectedUserId) {
            const filteredSales = sales.filter((sale) => sale.userId === selectedUserId);
            populateSalesTable(filteredSales);
        } else {
            populateSalesTable(sales);
        }
    });
}

displaySales();