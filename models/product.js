// models/product.js
import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Product = sequelize.define("Product", {
    name: { type: DataTypes.STRING, allowNull: false },
    quantity: { type: DataTypes.INTEGER, defaultValue: 0 },
    price: { type: DataTypes.FLOAT, allowNull: false },
    category: { type: DataTypes.STRING },
    reorder_level: { type: DataTypes.INTEGER, defaultValue: 5 },
});

export default Product;