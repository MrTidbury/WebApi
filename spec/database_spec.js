'use strict'
const database = require('../modules/database')
const request = require('request')
const passwordHash = require('password-hash')

describe('DataBase Suite of tests', function(){

	const hashedPassword = passwordHash.generate('testpassword')

	database.adduser('test user','test@user.com',hashedPassword,[12122,2,2,3])
	it('Can Add a user to the database', function(done) {
		const hashedPassword = passwordHash.generate('testpasswordwwe')
		const returnData = database.adduser('test user','Added User',hashedPassword,[12122,2,2,3])

		expect(returnData.name).toBe('test user')
		done()
	})
	it('Can Find the Correct User in the database',function(done){
		database.findUser('test@user.com', function(error, userFound){
			//console.log(userFound)
			expect(userFound.email).toBe('test@user.com')
		})
		done()
	})
	it('Can Validate a User in the Database', function(done){
		database.validateuser('test@user.com')
		database.findUser('test@user.com', function(error, userFound){
			expect(userFound.validation).toBe('true')
			done()
		})
	})
	it('Can Remove a User from the Database', function(done){
		const username = 'test2@user.com'
		const password = 'testpassword2'
		const hashedPassword2 = passwordHash.generate('testpassword2')
		const auth = 'Basic ' + new Buffer(username + ':' + password).toString('base64')
		const options = {
			url: 'http://localhost:8080/profile',
			headers: {
				'Authorization': auth
			}
		}

		const newUser = new database.User({name: 'Test User 2', email: 'test2@user.com', passwordHash: hashedPassword2, validation: 'true', validationCode: 'null', favorites: []})

		newUser.save(function(err){
			if(err) {
				console.log(err)
			}
		})
		request.del(options,function(error, response){
			var expected_responce = '"User test2@user.comSuccsessfully Removed"'
			expect(response.body).toBe(expected_responce)
			done()
		})
	})
})
