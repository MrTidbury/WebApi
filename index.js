'use strict'
/**
 * @fileOverview Routing For my Recipe API.
 * @author Jack Tidbury
 * @version 1.0.0
 */
const restify = require('restify')
const server = restify.createServer()
const internal_port = 8080
const getdata = require('./modules/getdata')
const database = require('./modules/database')
const authorisation = require('./modules/authorisation')
const user = require('./modules/user')

server.use(restify.fullResponse())
server.use(restify.queryParser())
server.use(restify.bodyParser())
server.use(restify.authorizationParser())

server.get('/search', getdata.recipeSearch)
server.get('/', getdata.test)
server.get('/recipe/:id', getdata.detailedRecipe)
server.get('/favorites',authorisation.authorise, user.favorites)
server.get('/validate/:email',authorisation.validate )
server.get('/profile/',authorisation.authorise, user.profile)

server.del('/profile/',authorisation.authorise, database.removeuser )
server.del('/favorites/:id',authorisation.authorise, database.removeFavourite)

server.post('/adduser', authorisation.registerUser)
server.put('/favorites/:id',authorisation.authorise, database.addFavourite)

const port = process.env.PORT || internal_port

server.listen(port, err => console.log(err || `App running on port ${port}`))
/** closeServer
*Closes the NodeJS Server, used in testing
*/
exports.closeServer = function(){
	server.close()
}
