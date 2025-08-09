// routes/messageRoutes.js
import express from 'express';
import {
    sendMessage,
    getMessagesByConversationId
} from '../controller/MessageController.js';

const router = express.Router();

// Endpoint untuk mengirim pesan
router.post('/', sendMessage);

// Endpoint untuk mendapatkan semua pesan dalam percakapan
router.get('/:conversation_id', getMessagesByConversationId);

export default router;