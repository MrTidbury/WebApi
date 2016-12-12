'use strict'
/**
 * Module to handle Authorization of users.
 * @module authorisation
 */
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

/** This Function the addition of a user to the database, it calls the database.addUser function to handle the datbase transaction. It takes all of the information required from the authorization header, and also the name header that are passed in the request. It the Hashes the password and generates a Validation Code. It also sends an email with the validation link to the users email address
* @alias module:authorisation.registerUser
* @param {Object} req - The request object
* @param {Object} res - The response object
* @returns {Response} Either the error or a succsessCode response is reutned to the user*/
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

	if (req.headers.name === '' || req.headers.name === undefined || req.headers.name === null){
		res.send(ErrCode,'Name Header cannot be empty')
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

/** This function authorises the user, using the authorisation header and then calls the next function if the authorisation is Succsessfull
* @alias module:authorisation.authorise
* @param {Object} req - The request object
* @param {Object} res - The response object
* @param {Function} next - This is the next function to be called after the completion of this function
* @returns {Response} If the response is generated, it means that the user has not been authorised
* @returns {Function} the next() function is called upon succsesfull authorisation to allow for other functions to be called
*/
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

/** This Function handles the validation of the user in the database, calls the database.validateuser function
* @alias module:authorisation.validate
* @param {Object} req - The request object
* @param {Object} res - The response object
* @returns {Response} Sends either an error or sucsess code back to the user
*/
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
