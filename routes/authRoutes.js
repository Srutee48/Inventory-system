import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();
const SECRET_KEY = "supersecret123";

router.post("/register", async (req, res) => {
    const { username, password, role } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: "Username and password are required" });
    }

    const validRoles = ["Admin", "Staff"];
     if (role && !validRoles.includes(role)) {
        return res.status(400).json({ error: "Invalid role specified" });
    }

    const userExists = await User.findOne({ where: { username } });
    if (userExists) {
        return res.status(400).json({ error: "Username already exists" });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            username,
            password: hashedPassword,
            role: role || "Staff",
        });
        res.status(201).json({ message: "User registered", user });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.post("/login", async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ where: { username } });
        if (!user) return res.status(404).json({ error: "User not found" });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(401).json({ error: "Wrong password" });

        const token = jwt.sign({ id: user.id, role: user.role }, SECRET_KEY, {
            expiresIn: "1h",
        });
        res.status(200).json({ message: "Login successful", token, role: user.role });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;