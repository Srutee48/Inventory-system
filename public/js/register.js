const registerForm = document.getElementById("register-form");
const messageContainer = document.getElementById("register-message");

registerForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const username = registerForm.username.value;
    const password = registerForm.password.value;
    const role = registerForm.role.value;

    if (!username || !password) {
        messageContainer.textContent = "Please enter both username and password";
        messageContainer.className = "error-message";
        return;
    }

    try {
        const response = await fetch("/api/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password, role }),
        });

        const data = await response.json();

        if (response.ok) {
            messageContainer.textContent = data.message;
            messageContainer.className = "success-message";
            setTimeout(() => {
                window.location.href = "login.html";
            }, 2000);
        } else {
            messageContainer.textContent = data.error || "Registration failed";
            messageContainer.className = "error-message";
        }
    } catch (error) {
        messageContainer.textContent = "An error occurred. Please try again.";
        messageContainer.className = "error-message";
    }
});