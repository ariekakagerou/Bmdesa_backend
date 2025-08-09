import express from 'express';
import CategoryController from '../controller/CategoryController.js'; // pastikan .js disertakan

const router = express.Router();

router.get('/', CategoryController.index);
router.post('/', CategoryController.store);
router.get('/:id', CategoryController.show);
router.put('/:id', CategoryController.update);
router.delete('/:id', CategoryController.destroy);

export default router;
