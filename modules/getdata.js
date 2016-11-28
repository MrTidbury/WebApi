'use strict'

const request = require('request')

exports.recipeSearch = function recipeSearch(req, res, next) {
	console.log("fucntion called")
  const q = req.query.q
  const apiKey = "IjxXa3lYuOmshmPo6MNAOhXRj1uSp1EuRcsjsnpfE2jyi3RS2c"
	
	var options = {
  url: 'https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/search?limitLicense=false&number=100&offset=0&query='+q,
  headers: {
    'X-Mashape-Key': apiKey
  }
};
 request.get(options, function(error, response, body) {
    if (!error && response.statusCode === 200) {
			const recipes = []
			const results = JSON.parse(body).results
			for (let i = 0; i < results.length; i++) {
				const recipe = {
					id: results[i].id,
					title: results[i].title,
					readyInMinutes: results[i].readyInMinutes
				}

				recipes.push(recipe)
			}
			res.send(200, recipes)
		} else {
			res.send(501, {message: 'Problem with SpoonAcular API query.', error: error, statusCode: response.statusCode})
		}
	})
         
}

exports.test = function test(req, res, next) {
res.send(200,"This is a test")    
}