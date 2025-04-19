// routes/productRoutes.js
import express from "express";
import {
    addProduct,
    getProducts,
    updateProduct,
    deleteProduct,
    getLowStockProducts,
} from "../controllers/productController.js";
import { authenticateToken, authorizeRole } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authenticateToken, getProducts);
router.post("/", authenticateToken, authorizeRole("Admin"), addProduct);
router.delete("/:id", authenticateToken, authorizeRole("Admin"), deleteProduct);
router.get("/low-stock", authenticateToken, authorizeRole("Admin", "Staff"), getLowStockProducts);
router.put("/:id", authenticateToken, authorizeRole("Admin", "Staff"), updateProduct);

export default router;