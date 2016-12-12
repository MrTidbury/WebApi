'use strict'
/**
 * Module to request and recive data from the SpoonAcular Api.
 * @module getdata
 */
const request = require('request')
const apiKey = require('../secrets').apiKey
const SuccessCode = 200
const ApiReturnLimit = 20
const FailureCode = 501

/** This is called when /search is called, it takes the query param that is passed in the request
* @alias module:getdata.recipeSearch
* @param {Object} req - The request object
* @param {Object} res - The response object
* @param {String} q - the search string, passed dynamicly in the request
* @returns {JSON} Top 20 results from the spoonacular Api with uninportant info filtered out */
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
					FindMore: 'api.tidbury,xyz/recipe/'+results[i].id
				}

				recipes.push(recipe)
			}
			res.send(SuccessCode, recipes)
		} else {
			res.send(FailureCode, {message: 'Problem with SpoonAcular API query.', error: error, statusCode: response.statusCode})
		}
	})

}

/** This is called when /recipe is called, it takes the ID string of the recipe as a paramiter that is passed in the request
* @alias module:getdata.detailedRecipe
* @param {Object} req - The request object
* @param {Object} res - The response object
* @param {String} id - the ID of the desired recipe, passed dynamicly in the request
* @returns {JSON} Returns more details of the desired recipe from the spoonacular Api with uninportant info filtered out */
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
					amount: ingredientList[i].originalString

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

/** Responds to the base request with a 200 response code to ensure the API is online
* @param {Object} req - The request object
* @param {Object} res - The response object
* @returns {null} 200 response Code */
exports.test = function test(req, res) {
	console.log('Test Function Called')
	res.send(SuccessCode, 'Welcome to Jack Tidburys Recipe Api for documentation please visit http://docs.api.tidbury.xyz alternitivly the repository can be found at https://gitlab.com/MrTidbury/WebApi')
}
