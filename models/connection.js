const mongoose = require('mongoose');

const config = require('../config');

module.exports = mongoose.connect(config.database, (err) => {
	if(err)
		console.log('MONGOOSE CONNECTION', err);
});