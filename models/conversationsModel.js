const mongoose = require('mongoose');

const conversationsSchema = new mongoose.Schema({
   members: {
      type: Array,
   }
},
   { timestamps: true }
);

const Conversation = mongoose.model('Conversations', conversationsSchema);

module.exports = Conversation;
