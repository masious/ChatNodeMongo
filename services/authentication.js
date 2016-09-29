const jwt = require('jsonwebtoken');

const User = require('../models/users');
const config = require('../config');

const authentication = function() {
	this.clients = {};
};

authentication.prototype.authenticate = (token, callback) => {
	if(token) {
	    return jwt.verify(token, config.secret, {ignoreExpiration: true});
  }
};

authentication.prototype.saveSocket = (userId, socket) => {
	if(!this.clients){
		this.clients = {};
	}

	this.clients[userId] = socket;
};

authentication.prototype.getSocket = (userId) => {
	return this.clients[userId];
}

module.exports = new authentication;