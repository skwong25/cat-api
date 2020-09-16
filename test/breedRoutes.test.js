// API integration tests for '/breed routes'
// (testing middleware functions in isolation would mean we dont need to test every case for the route tests - only success cases)

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
    it('respond with json object containing a list of all breeds - minimum 2 records to start', function (done) {
        request(appTest)
            .get('/breeds')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect((res) => {
                res.body.breeds[0].should.have.property('breedId', 1);
                res.body.breeds[0].should.have.property('name', 'tabby');
                res.body.breeds[0].should.have.property('description', "Tabbies have a distinctive 'M' shaped marking on their forehead, stripes by their eyes and across their cheeks, along their back, and around their legs and tail");
                res.body.breeds[1].should.have.property('breedId', 2);
                res.body.breeds[1].should.have.property('name', 'turkish angora');
                res.body.breeds[1].should.have.property('description', 'Turkish Angoras are one of the ancient, natural breeds of cat, having originated in central Turkey dated as far back as the 17th century, in the Ankara region.');
            })
            .expect(200, done);
    });
});

describe('GET /breeds/:breedId', function () {
    it('respond with json object containing information on a single breed', function (done) {
        request(appTest)
            .get('/breeds/1')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)

            .expect((res) => {
                res.body.should.have.property('breedId', 1);
                res.body.should.have.property('name', 'tabby');
                res.body.should.have.property('description');
            })
            .expect(200, done);
    });

    it('respond with 404 not found - invalid breed id', function (done) {
        request(appTest)
            .get('/breeds/9')
            .set('Accept', "text/html; charset=utf-8")
            .expect('Content-Type', "text/html; charset=utf-8")
            .expect(404, "id '9' not found in database")
            .end((err) => {
                if (err) return done(err); 
                done(); 
            })
    });
})

// variables for use in POST & PUT tests:

let validObj = {
    name: "norwegian mountain cat", 
    description: "Mountain-dwelling fairy cat with an ability to climb sheer rock faces that other cats cannot manage."
}

let invalidObj1 = {
    name: "norwegian mountain cat", 
    location: "Himalayan mountains",
}

let invalidObj2 = {
    name: "norwegian mountain cat",
    description: 100
}

let emptyObj = {
}

describe('PUT /breeds/:breedId', function () {

    it('respond with updated json object', function (done) {
        request(appTest)
            .put('/breeds/1')
            .send(validObj)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect((res) => {
                res.body.should.have.property('breedId', 1);
                res.body.should.have.property('name', 'norwegian mountain cat');
                res.body.should.have.property('description', 'Mountain-dwelling fairy cat with an ability to climb sheer rock faces that other cats cannot manage.');
            })
            .expect(200, done);
    });

    it('respond with 404 NOT FOUND - invalid id', function (done) {
        request(appTest)
            .put('/breeds/9')
            .send(validObj)
            .set('Accept', "text/html; charset=utf-8")
            .expect('Content-Type', "text/html; charset=utf-8")
            .expect(404, "id '9' not found in database")
            .end((err) => {
                if (err) return done(err); 
                done(); 
            })
    });

    it('respond with 400 BAD REQUEST - invalid property key', function (done) {
        request(appTest)
            .put('/breeds/1')
            .send(invalidObj1)
            .set('Accept', "text/html; charset=utf-8")
            .expect('Content-Type', "text/html; charset=utf-8")
            .expect(400, "Error: Property 'location' is invalid")
            .end((err) => {
                if (err) return done(err); 
                done(); 
            })
    });

    it('respond with 400 BAD REQUEST - invalid property value', function (done) {
        request(appTest)
            .put('/breeds/1')
            .send(invalidObj2)
            .set('Accept', "text/html; charset=utf-8")
            .expect('Content-Type', "text/html; charset=utf-8")
            .expect(400, `Error: Invalid description parameter: "100"`)
            .end((err) => {
                if (err) return done(err); 
                done(); 
            })
    });

    it('respond with 400 BAD REQUEST - invalid object', function (done) {
        request(appTest)
            .put('/breeds/1')
            .send(emptyObj)
            .set('Accept', "text/html; charset=utf-8") // what is the diff between .set and .expect ? 
            .expect('Content-Type', "text/html; charset=utf-8")
            .expect(400, 'Error: Request data is not a valid object. ')
            .end((err) => {
                if (err) return done(err); 
                done(); 
            })
    });
})

describe('POST /breeds/', function () {
    it('responds with 201 CREATED, returns newly-created breed record with newly-assigned id 3', function (done) {
        request(appTest)
            .post('/breeds/')
            .send(validObj)
            .set('Accept', 'application/json')
            .expect(200)
            .expect((res) => {
                res.body.breedId.should.equal(3);
                res.body.name.should.equal('norwegian mountain cat');
                res.body.description.should.equal('Mountain-dwelling fairy cat with an ability to climb sheer rock faces that other cats cannot manage.');
            })
            .end((err) => {
                if (err) return done(err); 
                done(); 
            })
    })
})

describe('DEL /breeds/:id', function () {
    it('responds with 204 NO CONTENT', function (done) {
        request(appTest)
            .delete('/breeds/1')
            .expect(204)
            .end((err) => {
                if (err) return done(err); 
                done(); 
            })
    })
})
