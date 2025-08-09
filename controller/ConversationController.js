// controller/ConversationController.js
import Conversation from '../models/Conversation.js';

// Membuat percakapan baru
export const createConversation = async(req, res) => {
    const { user_one_id, user_two_id } = req.body;

    if (!user_one_id || !user_two_id) {
        return res.status(400).json({ message: 'User one ID dan user two ID wajib diisi.' });
    }

    try {
        const conversationId = await Conversation.create({ user_one_id, user_two_id });
        res.status(201).json({ success: true, conversationId });
    } catch (err) {
        console.error('Error creating conversation:', err);
        res.status(500).json({ message: 'Gagal membuat percakapan', error: err.message });
    }
};

// Mengambil semua percakapan
export const getAllConversations = async(req, res) => {
    try {
        const conversations = await Conversation.getAll();
        res.status(200).json(conversations);
    } catch (err) {
        console.error('Error getting conversations:', err);
        res.status(500).json({ message: 'Gagal mendapatkan percakapan', error: err.message });
    }
};

// Mengambil percakapan berdasarkan ID
export const getConversationById = async(req, res) => {
    const { id } = req.params;

    try {
        const conversation = await Conversation.getById(id);
        if (!conversation) {
            return res.status(404).json({ message: 'Percakapan tidak ditemukan' });
        }
        res.status(200).json(conversation);
    } catch (err) {
        console.error('Error getting conversation by ID:', err);
        res.status(500).json({ message: 'Gagal mendapatkan percakapan', error: err.message });
    }
};