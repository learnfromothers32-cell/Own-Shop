import express from 'express';
import { getDashboardStats } from '../controllers/adminController.js';
import adminAuth from '../middleware/adminAuth.js';

const adminRouter = express.Router();

// All admin routes require admin authentication
adminRouter.get('/stats', adminAuth, getDashboardStats);

export default adminRouter;