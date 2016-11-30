'use strict'
const url = require('../secrets').dbUrl
const MongoClient = require('mongodb').MongoClient,
	f = require('util').format, //eslint-disable-line
	assert = require('assert')

// Use connect method to connect to the Server
exports.adduser = function adduser(name, email, passwordHash, favorites){
	MongoClient.connect(url, function(err, db) {
		assert.equal(null, err)
		console.log('Connected correctly to server')
		insertDocument(db, function() {
			db.close()
		})
	})

	const insertDocument = function(db, callback) {
		db.collection('users').insertOne( {
			'name': name,
			'email': email,
			'favorites': favorites,
			'passowordHash': passwordHash,
		}, function(err, result) {
			assert.equal(err, null)
			console.log('Inserted a document into the restaurants collection.')
			callback(result.ops)
			console.log(result.ops)
			return result.ops
		})
	}
}
