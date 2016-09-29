const md5 = require('md5');
const express = require('express');
const router = express.Router();


var jwt = require('jsonwebtoken');

const config = require('../config');
const jwtMw = require('../bin/jwt');
const User = require('../models/users.js');


/* GET users listing. */
router.get('/', (req, res, next) => {
  User.find({}, {password: false}, (err, users) => {
  	if(err)
  		return console.log(err);

  	res.send(users);
  });
});

router.post('/add',jwtMw, (req, res, next) => {
	let name = req.body.name;
	let phoneNumber = req.body.phoneNumber;
	user = new User({
		name,
		phoneNumber
	});
	user.save((err) => {
		res.send(user);
	});
});

router.post('/login', (req, res, next) => {
	let phoneNumber = req.body.phoneNumber;
	let password = req.body.password;
	User.findOne({phoneNumber: phoneNumber}, (err, user) => {
		if(err) throw err;

		if(!user) {
			res.json({
				success: false,
				message: 'No User found.'
			});
		} else {
			if(md5(password) == user.password){
					user = {
						_id: user._id,
						name: user.name,
						phoneNumber: user.phoneNumber
					};
				var token = jwt.sign(user, config.secret, {
					expiresIn: 60 * 60 * 24
				});

				res.json({
					success: true,
					token: token,
					user: user
				});
			} else {
				res.sendStatus(401);
			}
		}
	});
});

module.exports = router;