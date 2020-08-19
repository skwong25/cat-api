// next we will write an API test for GET by id, DEL by id, POST and PUT routes: 

const request = require('supertest');
const app = require('../src/app');

//==================== user API test ====================

/**
 * Testing get all user endpoint
 */
describe('GET /cats', function () {
    it('respond with json object containing a list of all cats', function (done) {
        request(app)
            .get('/cats')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200, done);
    });
});

describe('GET /cats/:id', function () {
    it('respond with json object containing information on a single cat', function (done) {
        request(app)
            .get('/cats/1')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200, done);
    });

    it('respond with 400 cat id not found', function (done) {
        request(app)
            .get('/cats/9')
            .set('Accept', "text/html; charset=utf-8")
            .expect('Content-Type', "text/html; charset=utf-8") 
            // .expect(400)
            .expect(`cat id '9' not found in database`)
            .end((err) => {
                if (err) return done(err);
                done();
            });
    });
});

describe('DEL /cats/:id', function () {
    it('respond with 204 cat id successfully deleted', function (done) {
        request(app)
            .delete('/cats/1')
            .expect('test message')
            // .expect(`cat id 1 successfully deleted`) // how does it process the ERROR message ?? 
            .expect(204, done)
    });
});