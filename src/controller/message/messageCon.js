const Message = require('../../models/messageModel/message');

async function addMessage(req, res) {
    try {
        const { name, email, subject, message } = req.body;

        if (!name || !email || !subject || !message) {
            return res.status(400).json({ message: 'All message fields are required' });
        }

        const newMessage = new Message({ name, email, subject, message });
        await newMessage.save();

        res.status(201).json({ message: 'Message sent successfully', data: newMessage });
    } catch (error) {
        res.status(500).json({ message: 'Error sending message', error: error.message });
    }
}

async function getAllMessages(req, res) {
    try {
        const messages = await Message.find().sort({ createdAt: -1 });
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching messages', error: error.message });
    }
}

async function deleteMessage(req, res) {
    try {
        const deletedMessage = await Message.findByIdAndDelete(req.params.id);

        if (!deletedMessage) {
            return res.status(404).json({ message: 'Message not found' });
        }

        res.status(200).json({ message: 'Message deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting message', error: error.message });
    }
}

module.exports = {
    addMessage,
    getAllMessages,
    deleteMessage
};
