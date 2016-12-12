'use strict'
/**
 * Module to handle the displaying of Users information, including profile and favorites
 * @module user
 */
const database = require('./database')
const request = require('request')
const async = require('async')
const errCode = 500
const succsesCode = 200

/** This function gets the Users Data from the Database and returns the data that is held on the user
* @alias module:user.profile
* @param {Object} req - The request object
* @param {Object} res - The response object
* @returns {JSON} Returns the Users Data in JSON form */
exports.profile = function profile(req, res) {
	const header=req.headers['authorization']||''
	const token=header.split(/\s+/).pop()||''
	const auth=new Buffer(token, 'base64').toString()
	const parts=auth.split(/:/)
	const email=parts[0]

	database.findUser(email,function(error, userFound){
		if(userFound === null){
			res.send(errCode,'No User Found')
		}		else if (error !== null){
			res.send(errCode,error)
		}		else{
			const userInfo = {
				name: userFound.name,
				email: userFound.email,
				validation: userFound.validation}

			res.send(succsesCode,userInfo)
		}
	})
}

/** This function makes use of the Async module to handle multiple requests; and array of URL's is generated based off of the users favorites and each of these URL's are called at the same time all of the responses are grouped and sent back to the user
* @alias module:user.favorites
* @param {Object} req - The request object
* @param {Object} res - The response object
* @returns {JSON} Returns the Users favorite recipes in JSON form
*/
exports.favorites = function favorites(req, res){
	const header=req.headers['authorization']||''
	const token=header.split(/\s+/).pop()||''
	const auth=new Buffer(token, 'base64').toString()
	const parts=auth.split(/:/)
	const email=parts[0]
	let favoritesId = []

	database.findUser(email, function(err, userObj){
		if (err){
			res.send(errCode,err)
		}		else if (userObj){
			favoritesId = userObj.favorites
			const requests = []

			for(let i = 0; i < favoritesId.length; i++){
				const url = {
					url: 'http://api.tidbury.xyz/recipe/'+favoritesId[i]
				}

				requests.push(url)
			}
			async.map(requests, function(obj, callback) {

				request(obj, function(error, response, body) {
					if (!error && response.statusCode === succsesCode) {
						 body = JSON.parse(body)
						callback(null, body)
					} else {
						callback(error || response.statusCode)
					}
				})
			}, function(err, results) {
				if (err) {
					res.send(errCode, err)
				} else {
					res.send(succsesCode, results)
				}
			})
		}		else{
			res.send(errCode,'No user Found')
		}
	})
}
