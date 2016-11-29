'use strict'
//comment here
const restify = require('restify')
const server = restify.createServer()
const internal_port = 8080
const getdata = require('./modules/getdata')

server.use(restify.fullResponse())
server.use(restify.queryParser())
server.use(restify.bodyParser())
server.use(restify.authorizationParser())

server.get('/search', getdata.recipeSearch)
server.get('/', getdata.test)
server.get('/recipe/:id', getdata.detailedRecipe)
const port = process.env.PORT || internal_port

server.listen(port, err => console.log(err || `App running on port ${port}`))
exports.closeServer = function(){
	server.close()
}
