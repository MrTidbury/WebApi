'use strict'

const request = require('request')
const apiKey = require('../secrets').apiKey

exports.recipeSearch = function recipeSearch(req, res, next) {
	console.log("fucntion called")
  const q = req.query.q

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
			for (let i = 0; i < 20; i++) {
				const recipe = {
					id: results[i].id,
					title: results[i].title,
					readyInMinutes: results[i].readyInMinutes,
					FindMore: 'http://localhost:8080/recipe/'+results[i].id
				}

				recipes.push(recipe)
			}
			res.send(200, recipes)
		} else {
			res.send(501, {message: 'Problem with SpoonAcular API query.', error: error, statusCode: response.statusCode})
		}
	})

}
