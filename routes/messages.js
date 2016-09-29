const User = require('../models/users');
const Conversation = require('../models/conversation');
const Message = require('../models/message');

const conversations = require('../services/conversations');
const authentication = require('../services/authentication');

module.exports = function(io) {
	io.on('connection', (socket) => {
		console.log('connected');

		let userId;
		socket.on('authenticate', (token) => {
			let decoded = authentication.authenticate(token);
			userId = decoded._id;

			authentication.saveSocket(decoded._id, socket);
			socket.emit('authenticated');
		});

		socket.on('message_coming', (msg) => {
			conversations.addMessage(msg, function(err, message) {
				if(err) {
					console.log(err);
				} else {
					socket.emit('message_success');

					// send message to the receiver
					authentication.getSocket(msg.receiver).emit('message_delivered', message);
				}
			});
		});

		socket.on('messages_requested', (members) => {
			conversations.getMessages(userId, 10, function(err, conversation) {
				if(err) {
					console.log(err);
				} else {
					console.log(conversation.messages.length);
					conversation.messages.forEach((msg) => {
						socket.emit('message_delivered', msg);
					});
				}
			});
		});
	});
};
