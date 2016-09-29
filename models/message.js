const mongoose = require('mongoose');
const Schema = mongoose.Schema;

require('./connection');

const MessageSchema = new Schema({
	sender: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
	receiver: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
	content: String,
	date: {
		type: Date,
		default: new Date
	},
	isSeen: {
		type: Boolean,
		default: false
	}
});

const Message = mongoose.model('Message', MessageSchema);

module.exports = Message;