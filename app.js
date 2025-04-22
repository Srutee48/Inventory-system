import express from 'express';
import cors from 'cors';
import sequelize from './config/db.js';
import productRoutes from './routes/productRoutes.js';
import authRoutes from './routes/authRoutes.js';
import saleRoutes from './routes/saleRoutes.js';
// import reportRoutes from './routes/reportRoutes.js'; // Import report routes
import { authenticateToken } from './middleware/authMiddleware.js';
import db from './models/index.js';
import bodyParser from 'body-parser';

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));


sequelize
  .authenticate()
  .then(() => {
    console.log('Connection to the database has been established successfully.');
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });

  // sequelize.sync({ alter: true })  // or force: true for dev reset
  // .then(() => console.log("All models were synchronized successfully."));

app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/sales', saleRoutes);
// app.use('/api/reports', reportRoutes); // Use report routes

app.get('/', (req, res) => {
  res.send('Welcome to the Inventory Management System API');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

