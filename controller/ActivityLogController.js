import { ActivityLog } from '../models/index.js';

const ActivityLogController = {
    async index(req, res) {
        const logs = await ActivityLog.findAll();
        res.json(logs);
    },

    async store(req, res) {
        const log = await ActivityLog.create(req.body);
        res.status(201).json(log);
    },

    async show(req, res) {
        const log = await ActivityLog.findByPk(req.params.id);
        if (!log) return res.status(404).json({ error: 'Not found' });
        res.json(log);
    },

    async destroy(req, res) {
        const log = await ActivityLog.findByPk(req.params.id);
        if (!log) return res.status(404).json({ error: 'Not found' });
        await log.destroy();
        res.status(204).send();
    }
};

export default ActivityLogController;