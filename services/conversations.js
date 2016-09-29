const mongoose = require('mongoose');

const Conversation = require('../models/conversation');
const Message = require('../models/message');
const User = require('../models/users');

const conversations = function() {};


conversations.prototype.find = function(user1, user2, callback) {
    Conversation.findOne({
        members: {
            $all: [user1, user2]
        }
    }, 'members', callback);
};

conversations.prototype.create = function(user1, user2, callback) {
    let conversation = new Conversation({
        members: [user1, user2]
    });

    conversation.save(callback);
};

conversations.prototype.findOrCreate = function(user1, user2, callback) {
    let self = this;
    this.find(user1, user2, (err, conversation) => {
        if(err) {
            callback(err);
        } else if(conversation) {
            callback(null, conversation);
        } else { // no conversation. create one.
            self.create(user1, user2, callback);
        }
    });
};

conversations.prototype.addMessage = function(message, callback) {
	message = new Message(message);
	message.save((err) => {
		if(err) {
			callback(err);
		} else {
			this.findOrCreate(message.sender, message.receiver, (err, conversation) => {
	        if(err) {
	            callback(err);
	        } else {
	            Conversation.findByIdAndUpdate(conversation._id, {
	                $push: {
	                    messages: message
	                }
	            }, {
	                safe: true,
	                upsert: true,
	                new: true
	            }, (err, conversation) => {
                    callback(err, message);
                });
	        }
	    });
		}
	});
};

conversations.prototype.getMessages = function(user1, numberOfMessages, callback) {
    if(! numberOfMessages) {
        numberOfMessages = 10;
    }
    Conversation
        .find({members: user1})
        .sort({date: -1})
        .limit(numberOfMessages)
        .populate('messages')
        .exec((err, conv) => {
        	conv = conv[0];

        	callback(err, conv);
        });
};

module.exports = new conversations;
