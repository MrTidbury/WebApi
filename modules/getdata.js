'use strict'

const request = require('request')
exports.recipeSearch = function recipeSearch(req, res, next) {
	console.log("fucntion called")
  const q = req.query.q
  const apiKey = "IjxXa3lYuOmshmPo6MNAOhXRj1uSp1EuRcsjsnpfE2jyi3RS2c"
  const url = 'https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/food/products/search?number=10&offset=0&query={q}'
  res.setHeader("X-Mashape-Key", apiKey)
  request.get(url, function(error, response, body) {
    if (!error && response.statusCode === 200) {
			const results = JSON.parse(body).items
			res.send(results)
		} else {
			res.send(501, {message: 'Problem with SpoonAcular API query.', error: error, statusCode: response.statusCode})
		}
	})
         
}
exports.test = function test(req, res, next) {
res.send(200,"This is a test")    
}