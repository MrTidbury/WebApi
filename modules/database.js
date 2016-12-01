'use strict'
const url = require('../secrets').dbUrl
const mongoose = require('mongoose')

mongoose.Promise = global.Promise

mongoose.connect(url)
const User = mongoose.model('User', {name: String, email: String, passwordHash: String, validation: String, validationCode: String, favorites: Array })

exports.adduser = function adduser(name, email, passwordHash, validationCode, favorites){
	const newUser = new User({name: name, email: email, passwordHash: passwordHash, validation: 'false', validationCode: validationCode, favorites: favorites})

	newUser.save(function(err){
		if(err) {
			console.log(err)
		}
	})
	return newUser
}

exports.findUser = function findUser(email, callback){
	User.findOne({email: email}, function(err, userObj){
		if(err){
			return callback(err)
		} else if (userObj){
			return callback(null,userObj)
		} else {
			return callback(null,null)
		}
	})
}

exports.validateuser = function validateuser(email, code){
	const query = { email: email }

	User.update(query, { validation: 'true' }, { multi: false }, callback)
	function callback(err, numAffected) {
		console.log(numAffected)
	}
}
