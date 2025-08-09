import Payment from '../models/payment.js';


const PaymentController = {
    async index(req, res) {
        try {
            const payments = await Payment.findAll();
            res.json(payments);
        } catch (err) {
            res.status(500).json({ error: 'Failed to fetch payments' });
        }
    },

    async store(req, res) {
        try {
            const payment = await Payment.create(req.body);
            res.status(201).json(payment);
        } catch (err) {
            res.status(400).json({ error: 'Failed to create payment' });
        }
    },

    async show(req, res) {
        const payment = await Payment.findByPk(req.params.id);
        if (!payment) return res.status(404).json({ error: 'Not found' });
        res.json(payment);
    },

    async update(req, res) {
        const payment = await Payment.findByPk(req.params.id);
        if (!payment) return res.status(404).json({ error: 'Not found' });
        await payment.update(req.body);
        res.json(payment);
    },

    async destroy(req, res) {
        const payment = await Payment.findByPk(req.params.id);
        if (!payment) return res.status(404).json({ error: 'Not found' });
        await payment.destroy();
        res.status(204).send();
    }
};

export default PaymentController;