'use strict'
const database = require('./database')
const request = require('request')
const async = require('async')
const errCode = 500
const succsesCode = 200

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

exports.favorites = function profile(req, res){
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
					url: 'http://localhost:8080/recipe/'+favoritesId[i]
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
