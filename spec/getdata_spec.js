'use strict'
const request = require('request')
const base_url = 'http://localhost:8080'
const search_url = 'http://localhost:8080/search?q=pizza'
const recipe_url = 'http://localhost:8080/recipe/516818'

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
				expect(body).toBe('"Api is online"')
				done()
			})
		})
	})

	describe('Get search/', function() {
		it('returns statusCode 200', function(done) {
			request.get(search_url, function(error, response){
				expect(response.statusCode).toBe(SuccessCode)
				done()
			})

		})
		it('returns JSON containing the Search Term', function(done) {
			request.get(search_url, function(error, response, body){
			expect(body).toContain(pizza) //eslint-disable-line
				done()
			})
		})
	})

	describe('Get recipe/',function(){
		it('returns statusCode 200', function(done) {
			request.get(recipe_url, function(error, response){
				expect(response.statusCode).toBe(SuccessCode)
				done()
			})
		})
		it('returns JSON containing Steps', function(done) {
			request.get(recipe_url, function(error, response, body){
				expect(body).toContain(pizza) //eslint-disable-line
				done()
			})
		})
	})
})
