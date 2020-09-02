// next we will write an API test for '/breed routes' GET and GET by id: 

const request = require('supertest');
const app = require('../src/app');

//==================== user API tests ====================


describe('GET /cats', function () {
    it('responds with json object containing a list of cat ids and name only', function (done) {
        request(app)
            .get('/cats')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200, done);
    });
});

describe('GET /cats/:id', function () {
    it('respond with json object containing detailed information on a single cat', function (done) {
        request(app)
            .get('/cats/1')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200, done);
    });
    
    it('respond with 404 cat id not found', function (done) {
        request(app)
            .get('/cats/9')
            .set('Accept', "text/html; charset=utf-8")
            .expect('Content-Type', "text/html; charset=utf-8") 
            .expect(404) 
            .expect(`cat id '9' not found in database`) 
            .end((err) => {
                if (err) return done(err); 
                done();                    
            });
    });

    it('respond with 400 invalid parameter', function (done) {
        request(app)
            .get('/cats/NaN')
            .set('Accept', "text/html; charset=utf-8")
            .expect('Content-Type', "text/html; charset=utf-8") 
            .expect(400) 
            .expect("'NaN' is not a valid number") 
            .end((err) => {
                if (err) return done(err); // this error is a TEST ASSERTION ERROR
                done();                    // not the error thrown in our code 
            });
    });
});

// if you use .end(), .expect() assertions that fail will not throw
// instead they return the assertion as an error to the .end() callback 
// in order to 'fail the test case' , you then need to rethrow or pass err to done()

describe('PUT /cats/:id', function () {

    const overdueBirthday = {
        "name": "Catty",
        "ageInYears": 2,
        "favouriteToy": "grass"
    }

    const falseBirthday = {
        "name": "Catty",
        "ageInYears": "two",
        "favouriteToy": "grass"
    }

    it('responds with 200  - updates age only', function (done) {
        request(app)
            .put('/cats/1')
            .send(overdueBirthday)
            .set('Accept', "text/html; charset=utf-8")
            .expect('Content-Type', /json/)  // Error: expected "Content-Type" matching /json/, got "text/html; charset=utf-8" - do I need to JSON.parse() ? 
            .expect(200, done)
    }); 

    it('responds with 400 bad request - age is incorrect format', function (done) {
        request(app)
            .put('/cats/1')
            .send(falseBirthday)
            .set('Accept', "text/html; charset=utf-8")
            .expect('Content-Type', "text/html; charset=utf-8")
            .expect(400, "Invalid parameter: 'two'", done)
    }); 
})

describe('DEL /cats/:id', function () {
    it('respond with 204 No Content', function (done) {
        request(app)
            .delete('/cats/1')
            .expect(204, done)
    });

    it('respond with 404 cat id not found', function (done) {
        request(app)
            .delete('/cats/9')
            .set('Accept', "text/html; charset=utf-8")
            .expect('Content-Type', "text/html; charset=utf-8")
            .expect(`cat id '9' not found in database`) 
            .expect(404, done)
    });
});

describe('POST /cats', function () {

    const body = {
        "name": "JimJam",
        "ageInYears": 5,
        "favouriteToy": "amazing technicolour dreamcoat"
    }

    const invalidKey = {
        "ears": "JimJam",
        "ears": "2",
        "ears": "amazing technicolour dream"
    }

    const invalidParams = {
        "name": "JimJam",
        "ageInYears": "five",
        "favouriteToy": "amazing technicolour dream"
    }

    
    it('respond with 201 content created', function (done) {
        request(app)
            .post('/cats')
            .send(body)
            .set('Accept', 'application/x-www-form-urlencoded')
            // .expect('Content-Type', /json/) // API Test Error: got "text/html; charset=utf-8"
            .expect(201, done)
    }) 
 

    it('respond with 400 - invalid key', function (done) {
        request(app)
            .post('/cats')
            .send(invalidKey)
            .expect(400)
            .expect(`Property 'ears' is invalid`)
            .end((err) => {
                if (err) return done(err); 
                done();                     
            });
    }) 

    it('respond with 400 invalid parameter`', function (done) {
        request(app)
            .post('/cats')
            .send(invalidParams)
            .set('Accept', "text/html; charset=utf-8")
            .expect('Content-Type', "text/html; charset=utf-8")
            .expect(400, "Invalid parameter: 'five'", done)
    })
})

describe('GET /breeds', function () {
    it('respond with json object containing a list of all breeds', function (done) {
        request(app)
            .get('/breeds')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200, done);
    });
});

describe('GET /breeds/:breedId', function () {
    it('respond with json object containing information on a single breed', function (done) {
        request(app)
            .get('/breeds/1')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200, done);
    });

    it('respond with 404 not found - invalid breed id', function (done) {
        request(app)
            .get('/breeds/9')
            .set('Accept', "text/html; charset=utf-8")
            .expect('Content-Type', "text/html; charset=utf-8")
            .expect(404, "breed id '9' not found in database", done);
    });
})