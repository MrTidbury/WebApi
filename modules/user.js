'use strict'
const database = require('./database')
const request = require('request')
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


exports.removeFav = function removeFav(req, res){
	//need to insert logic here
}
