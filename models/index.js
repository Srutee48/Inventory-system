// models/index.js
import User from './User.js';
import Product from './product.js';
// import StockHistory from './stockHistory.js';
import Sale from './sale.js';

// Product.hasMany(StockHistory, {
//     foreignKey: 'productId',
//     as: 'stockHistoryEntries',
// });
// StockHistory.belongsTo(Product, {
//     foreignKey: 'productId',
//     as: 'product',
// });

Product.hasMany(Sale, {
    foreignKey: 'productId',
    as: 'sales',
});
Sale.belongsTo(Product, {
    foreignKey: 'productId',
    as: 'product',
});

User.hasMany(Sale, {
    foreignKey: 'userId',
    as: 'sales',
});
Sale.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user',
});

// const db = { User, Product, StockHistory, Sale };
const db = { User, Product, Sale };

export default db;