'use strict'
const request = require('request')
const base_url = 'http://localhost:8080'
const search_url = 'http://localhost:8080/search?q=pizza'
const recipe_url = 'http://localhost:8080/recipe/516818'
const wrongrecipe_url = 'http://localhost:8080/recipe/51634343434818'
const index = require('../index.js')
const SuccessCode = 200
const Error501 = 501


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
			const contents = JSON.stringify(body)

			expect(contents).toContain('Pizza')
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
	it('Failes when given wrong id', function(done) {
		request.get(wrongrecipe_url, function(error, response){
			expect(response.statusCode).toBe(Error501)
			done()
		})
	})
	it('returns JSON containing Steps', function(done) {
		request.get(recipe_url, function(error, response, body){
			const title = JSON.stringify(body)

			expect(title).toContain('Pizza')
			index.closeServer()
			done()
		})
	})
})
