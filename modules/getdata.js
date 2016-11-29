'use strict'

const request = require('request')
const apiKey = require('../secrets').apiKey
const SuccessCode = 200
const ApiReturnLimit = 20
const FailureCode = 501

exports.recipeSearch = function recipeSearch(req, res) {
	console.log('Search Function Called')
	const q = req.query.q

	const options = {
		url: 'https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/search?limitLicense=false&number=100&offset=0&query='+q,
		headers: {
			'X-Mashape-Key': apiKey
		}
	}

	request.get(options, function(error, response, body) {
		if (!error && response.statusCode === SuccessCode) {
			const recipes = []
			const results = JSON.parse(body).results

			for (let i = 0; i < ApiReturnLimit; i++) {
				const recipe = {
					id: results[i].id,
					title: results[i].title,
					readyInMinutes: results[i].readyInMinutes,
					FindMore: 'http://localhost:8080/recipe/'+results[i].id
				}

				recipes.push(recipe)
			}
			res.send(SuccessCode, recipes)
		} else {
			res.send(FailureCode, {message: 'Problem with SpoonAcular API query.', error: error, statusCode: response.statusCode})
		}
	})

}
exports.detailedRecipe = function detailedRecipe(req,res){
	const id = req.params.id

	console.log('recipe function called'+id)
	const options = {
		url: 'https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/'+String(id)+'/information?includeNutrition=false',
		headers: {
			'X-Mashape-Key': apiKey
		}
	}

	request.get(options, function(error, response, body) {
		if (!error && response.statusCode === SuccessCode) {
			const results = JSON.parse(body)
			const ingredientList = JSON.parse(body).extendedIngredients
			const ingredients = []

			for (let i = 0; i < ingredientList.length;i++){
				const ingredient = {

					name: ingredientList[i].name,
					amount: ingredientList[i].amount,
					unit: ingredientList[i].unit

				}

				ingredients.push(ingredient)
			}
			const recipe = [
				{
					title: results.title,
					steps: results.instructions,
					time: results.readyInMinutes,
					sourceurl: results.sourceurl,
				  Ingredients: ingredients
				}
			]

			res.send(SuccessCode, recipe)
		} else {
			res.send(FailureCode, {message: 'Problem with SpoonAcular API query.', error: error, statusCode: response.statusCode})
		}
	})
}
exports.test = function test(req, res) {
	console.log('Test Function Called')
	res.send(SuccessCode, 'Api is online')
}
