import { checkAuth, logout } from "./auth.js";

window.onload = async () => {
     checkAuth ();
    await displayDashboard();
};

const logoutBtn = document.getElementById("logout-btn");
if (logoutBtn) {
    logoutBtn.addEventListener("click", logout);
}

async function fetchData(url) {
    try {
        const token = localStorage.getItem("token");
        if (!token) {
            console.log("ergaergEGRR");
            window.location.href = "/html/login.html";
        }
        const response = await fetch( "http://localhost:3000/api/products", {
            headers: {
                Authorization: `Bearer ${token}`,
                message :("Sending token:", token)
            },
        });
        if (response.status === 401) {
            // Token is invalid or expired
            localStorage.removeItem("token");
            window.location.href = "/html/login.html";
        }
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Failed to fetch data:", error);
        window.location.href = "/html/login.html";
    }
}

async function displayDashboard() {
    const products = await fetchData("http://localhost:3000/api/products");
    const totalProducts = products.length;
    const totalStock = products.reduce((sum, product) => sum + product.quantity, 0);

    const today = new Date().toISOString().split("T")[0];
    const sales = await fetchData(`http://localhost:3000/api/sales?date=${today}`);
    const salesToday = sales.reduce((sum, sale) => sum + sale.totalPrice, 0);

    document.getElementById("total-products-count").textContent = totalProducts;
    document.getElementById("total-stock-quantity").textContent = totalStock;
    document.getElementById("sales-today").textContent = salesToday;

    const productTable = document.getElementById("product-table").getElementsByTagName("tbody")[0];
    const categoryFilter = document.getElementById("category-filter");

    const categories = [...new Set(products.map((p) => p.category))];
    categories.forEach((category) => {
        const option = document.createElement("option");
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });

    function populateTable(products) {
        productTable.innerHTML = "";
        products.forEach((product) => {
            const row = productTable.insertRow();
            const nameCell = row.insertCell();
            const categoryCell = row.insertCell();
            const quantityCell = row.insertCell();
            const priceCell = row.insertCell();
            const actionsCell = row.insertCell();

            nameCell.textContent = product.name;
            categoryCell.textContent = product.category;
            quantityCell.textContent = product.quantity;
            priceCell.textContent = `$${product.price.toFixed(2)}`;

            const editButton = document.createElement("a");
            editButton.href = `edit-product.html?id=${product.id}`;
            editButton.textContent = "Edit";
            editButton.className = "action-btn edit-btn";
            actionsCell.appendChild(editButton);

            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Delete";
            deleteButton.className = "action-btn delete-btn";
            deleteButton.dataset.productId = product.id;
            deleteButton.addEventListener("click", () => {
                deleteProduct(product.id);
            });
            actionsCell.appendChild(deleteButton);
        });
    }

    categoryFilter.addEventListener("change", () => {
        const selectedCategory = categoryFilter.value;
        if (selectedCategory) {
            const filteredProducts = products.filter((p) => p.category === selectedCategory);
            populateTable(filteredProducts);
        } else {
            populateTable(products);
        }
    });
    populateTable(products);
}

async function deleteProduct(id) {
    if (confirm("Are you sure you want to delete this product?")) {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`http://localhost:3000/api/products/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                throw new Error("Failed to delete product");
            }
            displayDashboard();
        } catch (error) {
            console.error("Error deleting product:", error);
            alert("Failed to delete product");
        }
    }
}

// displayDashboard();