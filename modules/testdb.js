'use strict'
/*eslint-disable*/
const database = require('./database')
const authorisation = require('./authorisation')

console.log(authorisation.authorise('mrtidbury@gmail.com','password1234'))
