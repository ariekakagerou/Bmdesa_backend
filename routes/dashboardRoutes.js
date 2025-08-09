import express from 'express';
const router = express.Router();
import User from '../models/User.js';
import Product from '../models/Product.js';
import Transaction from '../models/Transaction.js';
import Report from '../models/Report.js';
import ActivityLog from '../models/activity_log.js';

router.get('/dashboard/stats', async(req, res) => {
    try {
        const totalUsers = await User.getAll();
        const totalProducts = await Product.getAll();
        const totalTransactions = await Transaction.getRecent();
        const totalReports = await Report.getPeriods();

        res.json({
            totalUsers: totalUsers.length,
            totalProducts: totalProducts.length,
            totalTransactions: totalTransactions.length,
            totalReports: totalReports.length,
        });
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/transactions/recent', async(req, res) => {
    try {
        const transactions = await Transaction.getRecent();
        res.json(transactions);
    } catch (error) {
        console.error('Error fetching recent transactions:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/activity-logs', async(req, res) => {
    try {
        const activityLogs = await ActivityLog.getAll();
        res.json(activityLogs);
    } catch (error) {
        console.error('Error fetching activity logs:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

const dashboardRoutes = (req, res) => {
    // ... kode untuk rute dashboard ...
};

export default router;