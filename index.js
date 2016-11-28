'use strict'
//comment here
const restify = require('restify')
const server = restify.createServer()

const getdata = require('./modules/getdata')

server.use(restify.fullResponse())
server.use(restify.queryParser())
server.use(restify.bodyParser())
server.use(restify.authorizationParser())

server.get('/search', getdata.recipeSearch)
server.get('/', getdata.test)

const port = process.env.PORT || 8080

server.listen(port, err => console.log(err || `App running on port ${port}`))
