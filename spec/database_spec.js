'use strict'
const database = require('../modules/database')

describe('Add user to db', function() {
	it('returns added user', function(done) {
		const returnData = database.adduser('Adam','Mesdsd','adsdafe23232321',[12122,2,2,3])

		expect(returnData.name).toBe('Adam')
		done()

	})

})
