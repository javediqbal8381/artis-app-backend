const router = require("express").Router();
 
const {createConversation, getConversation} = require('../controllers/conversationsController')

// new conversation
router.post("/", createConversation);
router.get("/:userId", getConversation)


module.exports = router;

