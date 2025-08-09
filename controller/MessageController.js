// controller/MessageController.js
import Message from '../models/Message.js';

// Mengirim pesan baru
export const sendMessage = async(req, res) => {
    const { conversation_id, sender_id, message } = req.body;

    if (!conversation_id || !sender_id || !message) {
        return res.status(400).json({ message: 'Conversation ID, sender ID, dan message wajib diisi.' });
    }

    try {
        const messageId = await Message.send({ conversation_id, sender_id, message });
        res.status(201).json({ success: true, messageId });
    } catch (err) {
        console.error('Error sending message:', err);
        res.status(500).json({ message: 'Gagal mengirim pesan', error: err.message });
    }
};

// Mengambil semua pesan dalam percakapan
export const getMessagesByConversationId = async(req, res) => {
    const { conversation_id } = req.params;

    try {
        const messages = await Message.getByConversationId(conversation_id);
        res.status(200).json(messages);
    } catch (err) {
        console.error('Error getting messages:', err);
        res.status(500).json({ message: 'Gagal mendapatkan pesan', error: err.message });
    }
};

// Tandai pesan sebagai sudah dibaca
export const markMessageAsRead = async(req, res) => {
    const { message_id } = req.params;
    try {
        await Message.markAsRead(message_id);
        res.status(200).json({ success: true, message: 'Pesan ditandai sudah dibaca' });
    } catch (err) {
        res.status(500).json({ message: 'Gagal update status pesan', error: err.message });
    }
};