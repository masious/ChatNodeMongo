const mongoose = require('mongoose');

require('./connection');

const UserSchema = new mongoose.Schema({
	name: {
		type: String,
		index: true
	},
	phoneNumber: {
		type: String,
		index: true
	},
	password: String
});

var User = mongoose.model('User', UserSchema);

module.exports = User;