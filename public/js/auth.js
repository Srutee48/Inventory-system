export const checkAuth = () => {
    if (!localStorage.getItem("token")) {
        window.location.href = "/html/login.html";
    }
};

export const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    window.location.href = "/html/login.html";
};