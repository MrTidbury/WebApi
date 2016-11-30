'use strict'
/*eslint-disable*/
const database = require('./database')
console.log((database.adduser('Adam','Adam@gmail.com','adsdafe23232321','thisisvalidationcode',[12122,2,2,3])).name)

const data = database.findUser('Adam@gmail.com', function(error, userFound){console.log(userFound.passwordHash)})
