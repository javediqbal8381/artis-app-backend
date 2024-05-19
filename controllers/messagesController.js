const Message = require("../models/messagesModel");

// Create message API endpoint
exports.createMessage = async (req, res) => {
    const messageData = req.body;
    try {
        let savedMessage;
        if (messageData.type === 'audio') {
            // If message type is audio, upload audio to GridFS
            savedMessage = await Message.create({
                sender: messageData.sender,
                text: messageData.text,// Save the unique filename for audio in the text field
                conversationId: messageData.conversationId,
                type: 'audio'
            });
        } else {
            // If message type is text, save text directly
            savedMessage = await Message.create(messageData);
        }
        res.status(200).json(savedMessage);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get messages API endpoint
exports.getConversationMessages = async (req, res) => {
    try {
        const messages = await Message.find({
            conversationId: req.params.conversationId
        });
        const processedMessages = await Promise.all(messages.map(async (message) => {
            if (message.type === 'audio') {
                return message.toObject();
            } else {
                // If message type is text, return the message as is
                return message.toObject();
            }
        }));
        res.status(200).json(processedMessages);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
