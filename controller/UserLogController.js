import UserLog from '../models/UserLog.js';

export const getAllUserLogs = async(req, res) => {
    try {
        const logs = await UserLog.getAll();
        res.status(200).json(logs);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

export const getUserLogsByUserId = async(req, res) => {
    const { user_id } = req.params;
    try {
        const logs = await UserLog.getByUserId(user_id);
        res.status(200).json(logs);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};