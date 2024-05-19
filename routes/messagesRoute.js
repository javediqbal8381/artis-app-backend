const router = require("express").Router();

const {createMessage, getConversationMessages} = require("../controllers/messagesController")

router.post("/", createMessage)

router.get("/:conversationId", getConversationMessages)


module.exports = router;

