import express from 'express';
import ShippingAddressController from '../controller/ShippingAddressController.js';

const router = express.Router();

router.get('/', ShippingAddressController.index);
router.get('/:id', ShippingAddressController.show);
router.post('/', ShippingAddressController.store);
router.put('/:id', ShippingAddressController.update);
router.delete('/:id', ShippingAddressController.destroy);

export default router;