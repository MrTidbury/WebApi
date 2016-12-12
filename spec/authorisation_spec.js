'use strict'
const database = require('../modules/database')
const request = require('request')
const passwordHash = require('password-hash')

describe('Authorisation Suite of tests', function(){
  const username = 'test@user.com'
  const password = 'testpassword'
  const auth = 'Basic ' + new Buffer(username + ':' + password).toString('base64')
  const options = {
    url: 'http://localhost:8080/adduser',
    headers: {
      'Authorization': auth,
      'name' : 'Test User'
    }
  }
  	it('Can Add a user to the database', function(done) {
      request.post(options,function(error ,response){
        expect(response.StatusCode).toBe(200)
      })
      request.del(options)
      done()
})
})
