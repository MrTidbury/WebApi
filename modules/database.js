'use strict'
const url = require('../secrets').dbUrl
const MongoClient = require('mongodb').MongoClient,
	f = require('util').format, //eslint-disable-line
	assert = require('assert')

// Use connect method to connect to the Server
exports.adduser = function adduser(name, email, passwordHash, favorites){

}
