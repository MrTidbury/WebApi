'use strict'
/**
 * Module to handle database transaction such as adding, removing, validating users in the Mongo Database.
 * @module database
 */
const url = require('../secrets').dbUrl
const mongoose = require('mongoose')
const succsessCode =200
const errCode = 500

mongoose.Promise = global.Promise

mongoose.connect(url)
const User = mongoose.model('User', {name: String, email: String, passwordHash: String, validation: String, validationCode: String, favorites: Array })

exports.User = User
/** Function to handle Adding a user to the Database
* @alias module:database.adduser
* @param {String} name - Users Name
* @param {String} email - Users email
* @param {String} passwordHash - The Hased Password to be stored in the Database
* @param {String} validationCode - The Generated code (using the UUID module) that will be needed to validate the user
* @param {Array} favorites - The normally empty array that is passed to the Database that will be populated later
* @returns {Object} Returns the object of the User that has just been added to the databse
*/
exports.adduser = function adduser(name, email, passwordHash, validationCode, favorites){
	const newUser = new User({name: name, email: email, passwordHash: passwordHash, validation: 'false', validationCode: validationCode, favorites: favorites})

	newUser.save(function(err){
		if(err) {
			console.log(err)
		}
	})
	return newUser
}

/** Function to handle Adding a user to the Database
* @alias module:database.findUser
* @param {String} email - Users email
* @param {Function} callback - The Callback function to be called when the async function is done
* @returns {Callback} Returns the callback with either the UserOBj or an error
*/
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

/** Function to Validate the User
* @alias module:database.validateuser
* @param {String} email - Users email
* @returns {null} Does not return anything
*/
exports.validateuser = function validateuser(email){
	const query = { email: email }

	User.update(query, { validation: 'true' }, { multi: false }, callback)
	 function callback(err, numAffected) {  //eslint-disable-line
		console.log(err)
		return numAffected
	}
}

/** This Function handles the removall of a user from the database, this fuction is only called when the user has been authorized
* @alias module:database.removeuser
* @param {Object} req - The request object
* @param {Object} res - The response object
* @returns {Response} Either the error or a succsessCode response is reutned to the user*/
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
			res.send(succsessCode,'User '+email+' Succsessfully Removed')
		}
	})
}

/** This Function adds a new ID to the favorites array that is stored in the database, only called when the user has been authorized
* @alias module:database.addFavourite
* @param {Object} req - The request object
* @param {Object} res - The response object
* @param {String} id - Id to be added. Passed dynamicly in the request
* @returns {Response} Either the error or a succsessCode response is reutned to the user*/
exports.addFavourite = function addFavourite(req, res){
	const header=req.headers['authorization']||''
	const token=header.split(/\s+/).pop()||''
	const auth=new Buffer(token, 'base64').toString()
	const parts=auth.split(/:/)
	const email=parts[0]
	const id = req.params.id

	User.findOne({email: email}, function(err, userObj){
		if(err){
			return res.send(errCode,err)
		} else if (userObj){
			const favorites = userObj.favorites

			if(!favorites.includes(id)){
				User.findOneAndUpdate({email: email},{$push: {favorites: id}},{safe: true, upsert: true},function(err) {
					if(err){
						res.send(errCode,err)
					}		else
						res.send(succsessCode, 'Recipie added to favorites')
				}
			)
			}			else{
				res.send(errCode,'Item is already in the Users favorites')
			}
		} else {
			res.send(errCode,'No User Found')
		}
	})

}

/** This Function adds removes the  ID to the favorites array that is stored in the database, only called when the user has been authorized
* @alias module:database.removeFavourite
* @param {Object} req - The request object
* @param {Object} res - The response object
* @param {String} id - Id to be added. Passed dynamicly in the request
* @returns {Response} Either the error or a succsessCode response is reutned to the user*/
exports.removeFavourite = function addFavourite(req, res){
	const header=req.headers['authorization']||''
	const token=header.split(/\s+/).pop()||''
	const auth=new Buffer(token, 'base64').toString()
	const parts=auth.split(/:/)
	const email=parts[0]
	const id = req.params.id

	User.findOneAndUpdate({email: email},{$pull: {favorites: id}},{safe: true, upsert: true},function(err) {
		if(err){
			res.send(errCode,err)
		}		else
			res.send(succsessCode, 'Recipie removed from favorites')
	}
)
}
