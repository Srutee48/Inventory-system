import { checkAuth, logout } from "./auth.js";

window.onload = checkAuth();
const logoutBtn = document.getElementById("logout-btn");
if (logoutBtn) {
    logoutBtn.addEventListener("click", logout);
}

async function fetchSalesReport() {
    try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:3000/api/reports/sales-summary", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (!response.ok) {
            throw new Error("Failed to fetch sales report");
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching sales report:", error);
        window.location.href = "index.html";
    }
}

async function displaySalesReport() {
    const reportData = await fetchSalesReport();
    const reportTable = document.getElementById("sales-report-table").getElementsByTagName("tbody")[0];

    reportData.forEach((item) => {
        const row = reportTable.insertRow();
        row.insertCell().textContent = item.product.name;
        row.insertCell().textContent = item.totalQuantitySold;
        row.insertCell().textContent = `$${item.totalRevenue.toFixed(2)}`;
        row.insertCell().textContent = item.totalSalesCount;
    });
}

displaySalesReport();