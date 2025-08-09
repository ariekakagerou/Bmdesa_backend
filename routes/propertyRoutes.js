import express from 'express';
const router = express.Router();
import PropertyController from '../controller/PropertyController.js';
import authenticateJWT from '../middleware/auth.js'; // harus menggunakan export default di middleware

// CREATE
router.post('/', authenticateJWT, PropertyController.createProperty);

// GET ALL
router.get('/', authenticateJWT, PropertyController.getAllProperties);

// UPDATE
router.put('/:property_id', authenticateJWT, PropertyController.updateProperty);

// DELETE
router.delete('/:property_id', authenticateJWT, PropertyController.deleteProperty);

export default router;