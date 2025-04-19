// routes/reportRoutes.js
import express from 'express';
import {
    getStockHistory,
    getSalesSummary,
} from '../controllers/reportController.js';
import { authenticateToken, authorizeRole } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/stock-history', authenticateToken, authorizeRole('Admin'), getStockHistory);
router.get('/sales-summary', authenticateToken, authorizeRole('Admin'), getSalesSummary);

export default router;