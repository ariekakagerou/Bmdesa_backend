// routes/faqRoutes.js
import express from 'express';
import FaqController from '../controller/FaqController.js';

const router = express.Router();

// GET /api/faqs - Get all FAQs
router.get('/', FaqController.getAllFaqs);

// GET /api/faqs/search?q=keyword - Search FAQs
router.get('/search', FaqController.searchFaqs);

// GET /api/faqs/categories - Get all categories
router.get('/categories', FaqController.getCategories);

// GET /api/faqs/category/:category - Get FAQs by category
router.get('/category/:category', FaqController.getFaqsByCategory);

// GET /api/faqs/:id - Get FAQ by ID
router.get('/:id', FaqController.getFaqById);

// POST /api/faqs - Create new FAQ
router.post('/', FaqController.createFaq);

// PUT /api/faqs/:id - Update FAQ
router.put('/:id', FaqController.updateFaq);

// DELETE /api/faqs/:id - Delete FAQ
router.delete('/:id', FaqController.deleteFaq);

export default router;
