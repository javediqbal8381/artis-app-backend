const Conversation = require("../models/conversationsModel");


// Get orders by shop
exports.createConversation = async (req, res) => {
    const newConversation = new Conversation({
        members: [req.body.senderId, req.body.receiverId]
    })

    try {
        const savedConversation = await newConversation.save()
        res.status(200).json(savedConversation)
    } catch (error) {
        res.status(500).json(err)
    }
}

// get a user conversation 

exports.getConversation = async (req, res) => {
    try {
        const userConversations = await Conversation.find({
            members: { $in: [req.params.userId] }
        })
        res.status(200).json(userConversations)
    } catch (error) {
        res.status(500).json(err)
    }
}