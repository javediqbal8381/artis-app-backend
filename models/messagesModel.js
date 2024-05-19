const mongoose = require('mongoose');

const messagesSchema = new mongoose.Schema({
    conversationId: {
        type: String,
    },
    sender: {
        type: String
    },
    text: {
        type: String
    },
    type: {
        type: String,
    }
}, {timestamps: true});

const Message = mongoose.model('Messages', messagesSchema);

module.exports = Message;
