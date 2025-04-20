const loginForm = document.getElementById("login-form");
const messageContainer = document.getElementById("login-message");

loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const username = loginForm.username.value;
    const password = loginForm.password.value;

    if (!username || !password) {
        messageContainer.textContent = "Please enter both username and password";
        messageContainer.className = "error-message";
        return;
    }

    try {
        const response = await fetch("http://localhost:3000/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password }),
        });

        console.log("Response status:", response.status); // Check the HTTP status code
        console.log("Response headers:", response.headers);
        const data = await response.json();
        console.log("Response data:", data);
        if (response.ok) {
            localStorage.setItem("token", data.token);
            console.log("Stored token:", localStorage.getItem("token"));
            localStorage.setItem("userRole", data.role);
            console.log("Login successful.  Redirecting...");
            window.location.href = "/html/index.html";
        } else {
            messageContainer.textContent = data.error || "Login failed";
            messageContainer.className = "error-message";
        }
    } catch (error) {
        messageContainer.textContent = "An error occurred. Please try again.";
        messageContainer.className = "error-message";
    }
});