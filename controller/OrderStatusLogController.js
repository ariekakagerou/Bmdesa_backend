import { OrderStatusLog } from '../models/index.js';

const OrderStatusLogController = {
    async index(req, res) {
        const logs = await OrderStatusLog.findAll();
        res.json(logs);
    },

    async store(req, res) {
        const log = await OrderStatusLog.create(req.body);
        res.status(201).json(log);
    },

    async show(req, res) {
        const log = await OrderStatusLog.findByPk(req.params.id);
        if (!log) return res.status(404).json({ error: 'Not found' });
        res.json(log);
    },

    async update(req, res) {
        const log = await OrderStatusLog.findByPk(req.params.id);
        if (!log) return res.status(404).json({ error: 'Not found' });
        await log.update(req.body);
        res.json(log);
    },

    async destroy(req, res) {
        const log = await OrderStatusLog.findByPk(req.params.id);
        if (!log) return res.status(404).json({ error: 'Not found' });
        await log.destroy();
        res.status(204).send();
    }
};

export default OrderStatusLogController;