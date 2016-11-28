var request = require('request');
var base_url = 'http://localhost:8080'
var getdata = require('../modules/getdata.js')
var index = require('../index.js')
describe("GetData Test",function(){

  describe("Get /", function() {
    it("returns statusCode 200", function(done) {
      request.get(base_url, function(error, response, body){
        expect(response.statusCode).toBe(200);
        done();
      });
    });
    it("returns Api is Online", function(done) {
      request.get('base_url', function(error, response, body){
        console.log(request.body)
        expect(body).toBe("Api is online");
        index.closeServer();
        done();
      });
    });
  });
});
