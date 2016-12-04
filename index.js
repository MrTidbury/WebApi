'use strict'
//comment here
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
server.post('/adduser', authorisation.registerUser)
server.get('/favorites',authorisation.authorise, getdata.test)
server.get('/validate/:email',authorisation.validate )
server.del('/delete/',authorisation.authorise, database.removeuser )
server.get('/profile/',authorisation.authorise, user.profile)

const port = process.env.PORT || internal_port

server.listen(port, err => console.log(err || `App running on port ${port}`))
exports.closeServer = function(){
	server.close()
}
