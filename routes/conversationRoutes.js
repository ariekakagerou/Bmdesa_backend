// routes/conversationRoutes.js
import express from 'express';
import {
    createConversation,
    getAllConversations,
    getConversationById
} from '../controller/ConversationController.js';

const router = express.Router();

// Endpoint untuk membuat percakapan
router.post('/', createConversation);

// Endpoint untuk mendapatkan semua percakapan
router.get('/', getAllConversations);

// Endpoint untuk mendapatkan percakapan berdasarkan ID
router.get('/:id', getConversationById);

export default router;