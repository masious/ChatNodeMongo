const mongoose = require('mongoose');
const Schema = mongoose.Schema;

require('./connection');

const ConversationSchema = new Schema({
	members: [{
		type: Schema.Types.ObjectId,
		ref: 'User'
	}],
	messages: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Message'
		}
	]
});

const Conversation = mongoose.model('Conversation', ConversationSchema);

module.exports = Conversation;