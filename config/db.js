import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env file

const dbName = process.env.DB_NAME || 'inventory_db';
const dbUser = process.env.DB_USER || 'ims_user'; // Replace with your MySQL username
const dbPassword = process.env.DB_PASSWORD || 'SUPPLY@321'; // Replace with your MySQL password
const dbHost = process.env.DB_HOST || 'localhost';      // Typically 'localhost'
const dbPort = process.env.DB_PORT || 3306;          // Default MySQL port is 3306

const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
    host: dbHost,
    port: dbPort,
    dialect: 'mysql', // Specify that you're using MySQL
    //   dialectOptions: { // Only if you have specific requirements
    //     ssl: true,  // Example: Enable SSL (if needed)
    //   },
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
    },
    logging: false, // Set to true to see SQL queries in the console (for debugging)
});

export default sequelize;