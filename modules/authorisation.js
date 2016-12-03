'use strict'
const database = require('./database')
const passwordHash = require('password-hash')
const uuidV4 = require('uuid')
const mailer = require('nodemailer')
const ErrCode = 500
const AuthErrCode = 403
const SuccsessCode = 200
const emailaddr = require('../secrets').emailaddr
const emailpsw = require('../secrets').emailpsw

const smtpTransport = mailer.createTransport('SMTP',{
	service: 'Gmail',
	auth: {
		user: emailaddr,
		pass: emailpsw
	}
})


exports.registerUser = function registerUser(req, res){
	const header=req.headers['authorization']||''
	const token=header.split(/\s+/).pop()||''
	const auth=new Buffer(token, 'base64').toString()
	const parts=auth.split(/:/)
	const email=parts[0]
	const password=parts[1]
	const hashedPassword = passwordHash.generate(password)
	const validationCode = uuidV4()
	const validationUrl = 'localhost:8080/validate/'+email+'?q='+validationCode
	const mail = {
			 from: 'Jack Tidbury API <api@tidbury.xyz>',
			 to: email,
			 subject: 'Please Validate your account',
			 text: 'Please Click here to validate you account',
			 html: '<a href="'+validationUrl+'">Please Click Here to validate your account</a>'
	 }

	console.log(validationCode)
	database.findUser(email, function(error, userFound){
		if(userFound === null){
			database.adduser(req.headers.name,email,hashedPassword,validationCode,[])
			smtpTransport.sendMail(mail, function(error,response){
				if(error){
					console.log(error)
				}else{
					console.log('Message sent: ' + response.message)
				}
				smtpTransport.close()
			})
			res.send(SuccsessCode,'User Added')
		}		else if (error !== null) {
			res.send(ErrCode,error)
		}		else{
			res.send(AuthErrCode,'User Alreaady Exists with the email'+email)
		}
	})
}

exports.authorise = function authorise(req, res, next){
	const header=req.headers['authorization']||''
	const token=header.split(/\s+/).pop()||''
	const auth=new Buffer(token, 'base64').toString()
	const parts=auth.split(/:/)
	const email=parts[0]
	const password=parts[1]

	database.findUser(email, function(error, userFound){
		if(userFound === null){
			return	res.send(AuthErrCode,'No User Found with this Email')
		}		else if (error !== null){
			return 	res.send(ErrCode, error)
		}		else{

			if(passwordHash.verify(password, userFound.passwordHash) && userFound.validation === 'true'){
				console.log('validated')
				return next()
			}	else{
				return 	res.send(AuthErrCode, 'Inccorect Password or Unauthorized user')
			}
		}
	})
}

exports.validate = function validate(req, res){
	const validationCode = req.query.q
	const email = req.params.email

	database.findUser(email, function(error, userFound){
		if(userFound === null){
			res.send(AuthErrCode,'No user found with email'+email)
		}		else if (error !== null) {
			res.send(ErrCode,error)
		}		else{
			if (userFound.validationCode === validationCode) {
				database.validateuser(email)
				res.send(SuccsessCode, 'Congratulations '+userFound.name+ 'your account is now validated')
			}			else{
				res.send(AuthErrCode,'incorrect code')
			}
		}
	})

}
