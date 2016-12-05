'use strict'
const url = require('../secrets').dbUrl
const mongoose = require('mongoose')
const succsessCode =200
const errCode = 500

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

exports.validateuser = function validateuser(email){
	const query = { email: email }

	User.update(query, { validation: 'true' }, { multi: false }, callback)
	 function callback(err, numAffected) {  //eslint-disable-line
		console.log(err)
		console.log(numAffected)
	}
}

exports.removeuser = function removeuser(req, res){
	const header=req.headers['authorization']||''
	const token=header.split(/\s+/).pop()||''
	 const auth=new Buffer(token, 'base64').toString()
	const parts=auth.split(/:/)
	const email=parts[0]

	console.log(email)
	User.remove({email: email}, function(err){
		if(err){
			res.send(errCode,err)
		}		else{
			res.send(succsessCode,'User '+email+'Succsessfully Removed')
		}
	})
}

exports.addFavourite = function addFavourite(req, res){
	const header=req.headers['authorization']||''
	const token=header.split(/\s+/).pop()||''
	const auth=new Buffer(token, 'base64').toString()
	const parts=auth.split(/:/)
	const email=parts[0]
	const id = req.params.id

	User.findOneAndUpdate({email: email},{$push: {favorites: id}},{safe: true, upsert: true},function(err) {
		if(err){
			res.send(500,err)
		}		else
			res.send(200, 'Recipie added to favorites')
	}
)
}
exports.removeFavourite = function addFavourite(req, res){
	const header=req.headers['authorization']||''
	const token=header.split(/\s+/).pop()||''
	const auth=new Buffer(token, 'base64').toString()
	const parts=auth.split(/:/)
	const email=parts[0]
	const id = req.params.id

	User.findOneAndUpdate({email: email},{$pull: {favorites: id}},{safe: true, upsert: true},function(err) {
		if(err){
			res.send(500,err)
		}		else
			res.send(200, 'Recipie removed to favorites')
	}
)
}
