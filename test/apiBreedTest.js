// next we will write an API test for '/breed routes' GET and GET by id: 

const request = require('supertest');
const should = require('should');

const buildServer = require('../src/app'); 
const generateTestId = {
    generate() {
        return "tmk60ux2b" 

    } 
}
    
const appTest = buildServer(generateTestId);

//==================== user API tests ====================

describe('GET /breeds', function () {
    it('respond with json object containing a list of all breeds', function (done) {
        request(appTest)
            .get('/breeds')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200, done);
    });
});

describe('GET /breeds/:breedId', function () {
    it('respond with json object containing information on a single breed', function (done) {
        request(appTest)
            .get('/breeds/1')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200, done);
    });

    it('respond with 404 not found - invalid breed id', function (done) {
        request(appTest)
            .get('/breeds/9')
            .set('Accept', "text/html; charset=utf-8")
            .expect('Content-Type', "text/html; charset=utf-8")
            .expect(404, "breed id '9' not found in database", done);
    });
})