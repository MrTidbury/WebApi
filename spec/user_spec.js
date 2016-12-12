'use-strict'
const user = require('../modules/user')
const database = require('../modules/database')
const passwordHash = require('password-hash')
const request = require('request')

describe('Users Suite of Tests', function(){
  const hashedPassword = passwordHash.generate('userpassword')
  const newUser = new database.User({name: 'Test User For User SPEC', email: 'userspec@user.com', passwordHash: hashedPassword, validation: 'true', validationCode: 'null', favorites: []})
  const username = 'userspec@user.com'
  const password = 'userpassword'
  const auth = 'Basic ' + new Buffer(username + ':' + password).toString('base64')

  newUser.save(function(err){
    if(err) {
      console.log(err)
    }
  })

  it('Can add favorites of user',function(done){
    const options = {
      url: 'http://localhost:8080/favorites/630746',
      headers: {
        'Authorization': auth
      }
    }
    request.put(options,function(error, response){
			var expected_responce = '"Recipie added to favorites"'
      console.log(response)
			expect(response).toBe(undefined)
			done()
		})

  })
  it('Can remove favorites of user',function(done){
    const options = {
      url: 'http://api.tidbury.xyz/favorites/630746',
      headers: {
        'Authorization': auth
      }
    }
    request.del(options,function(error, response){
			var expected_responce = '"Recipie removed to favorites"'
			expect(response.body).toBe(expected_responce)
			done()
		})
  })
  it('Can return profile of user',function(done){
    const options = {
      url: 'http://api.tidbury.xyz/profile',
      headers: {
        'Authorization': auth
      }
    }
    request.get(options,function(error, response){
			var expected_responce = '"userspec@user.com"'
			expect(response.body).toContain(expected_responce)
			done()
		})
  })
})
