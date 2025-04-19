// controllers/productController.js
import Product from "../models/product.js";
import StockHistory from "../models/stockHistory.js";
import { Op } from 'sequelize';

const createStockHistoryEntry = async (productId, userId, oldQuantity, newQuantity, transactionType) => {
    await StockHistory.create({
        productId,
        userId,
        oldQuantity,
        newQuantity,
        transactionType,
    });
};

export const addProduct = async (req, res) => {
    const { name, quantity, price, category, reorder_level } = req.body;
    const userId = req.user.id;

    if (!name || quantity == null || price == null || !category || reorder_level == null) {
        return res.status(400).json({ message: "All fields are required." });
    }

    if (quantity < 0 || price < 0 || reorder_level < 0) {
        return res.status(400).json({ message: "Invalid values provided." });
    }

    try {
        const product = await Product.create({
            name,
            quantity,
            price,
            category,
            reorder_level,
        });

        // try {
        //     await createStockHistoryEntry(product.id, userId, 0, quantity, "ADD");
        //   } catch (err) {
        //     console.error("Stock history logging failed:", err);
        //   }

        // res.status(201).json(product);
        res.status(201).json({
            message: "Product created successfully",
            product,
          });
    } catch (error) {
        console.error("Create Product Error:", error);
        res.status(500).json({ error: "Server Error" });
      }
};

export const getProducts = async (req, res) => {
    try {
        const products = await Product.findAll();
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, quantity, price, category, reorder_level } = req.body;
        const userId = req.user.id;

        if (!name || quantity == null || price == null || !category || reorder_level == null) {
            return res.status(400).json({ message: "All fields are required." });
        }

        if (quantity < 0 || price < 0 || reorder_level < 0) {
            return res.status(400).json({ message: "Invalid values provided." });
        }

        const product = await Product.findByPk(id);
        if (!product) {
            return res.status(404).json({ message: "Product not found." });
        }

        const oldQuantity = product.quantity;

        await product.update({ name, quantity, price, category, reorder_level });

        await createStockHistoryEntry(id, userId, oldQuantity, quantity, "UPDATE");

        res.status(200).json({ message: "Product updated successfully." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error while updating product." });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const product = await Product.findByPk(id);

         if (!product) {
            return res.status(404).json({ message: "Product not found." });
        }
        const oldQuantity = product.quantity;

        await Product.destroy({ where: { id } });

         //await createStockHistoryEntry(id, userId, oldQuantity, 0, "DELETE");
        res.json({ message: "Product deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getLowStockProducts = async (req, res) => {
    try {
        const lowStockProducts = await Product.findAll({
            where: {
                quantity: {
                    [Op.lte]: Sequelize.col('reorder_level'),
                },
            },
        });
        res.json(lowStockProducts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};