const Conversation = require("../models/conversationsModel");
const User = require("../models/usersModel");


exports.createConversation = async (req, res) => {
    const senderId = req.body.senderId;
    const receiverId = req.body.receiverId;

    // Check if a conversation with both senderId and receiverId as bot IDs already exists
    const botConversation = await Conversation.findOne({
        members: { $all: [senderId, receiverId] },
        $nor: [
            { members: senderId },
            { members: receiverId }
        ]
    });

    if (botConversation) {
        // If conversation with bot IDs exists, return error
        return res.status(400).json({ error: 'Conversation with bot IDs already exists' });
    }

    // If no conversation with bot IDs exists, create a new conversation
    const newConversation = new Conversation({
        members: [senderId, receiverId]
    });

    try {
        const savedConversation = await newConversation.save();
        res.status(200).json(savedConversation);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create conversation', details: error });
    }
}

// get a user conversation 

exports.getConversation = async (req, res) => {
    try {
        const userConversations = await Conversation.find({
            members: { $in: [req.params.userId] }
        })
        const modified = await Promise.all(
            userConversations.map(async c => {
                const user = await User.findOne({ _id : {$in: c.members} }).select("username")
                return {...c.toObject(), username: user.username}
            })
        )
        res.status(200).json(modified)
    } catch (error) {
        res.status(500).json(err)
    }
}