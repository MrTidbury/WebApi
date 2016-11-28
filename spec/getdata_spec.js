'use strict'
const request = require('request')
const base_url = 'http://localhost:8080'
const index = require('../index.js')
const SuccessCode = 200

describe('GetData Test',function(){

	describe('Get /', function() {
		it('returns statusCode 200', function(done) {
			request.get(base_url, function(error, response){
				expect(response.statusCode).toBe(SuccessCode)
				done()
			})

		})
		it('returns Api is Online', function(done) {
			request.get(base_url, function(error, response, body){
				console.log(body)
				expect(body).toBe('"Api is online"')
				index.closeServer()
				done()
			})
		})
	})
})
