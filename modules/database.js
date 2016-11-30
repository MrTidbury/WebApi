'use strict'
const url = require('../secrets').dbUrl
const mongoose = require('mongoose')

mongoose.Promise = global.Promise

mongoose.connect(url)
const User = mongoose.model('User', {name: String, email: String, passwordHash: String, validation: String, validationCode: String, favorites: Array })

exports.adduser = function adduser(name, email, passwordHash, validationCode, favorites){
	const newUser = new User({name: name, email: email, passwordHash: passwordHash, validation: 'false', validationCode: validationCode, favorites: favorites})

	//console.log('adding user '+newUser)
	newUser.save(function(err,UserObj){
		if(err) {
			//console.log(err)
		}		else {
			//console.log('added User '+UserObj)
		}
	})
	return newUser
}
