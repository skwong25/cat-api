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


describe('GET /cats', function () {
    it('responds with json object containing a list of cats with id & name properties only', function (done) {
        request(appTest)
            .get('/cats')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(function (res) {
                let object = JSON.stringify(res.body); // Note that this parsing from JSON to JS object was only to be able to console log result 
                let catOne = object.cats;          
                console.log("object: " + object);    // {"cats":[{"id":"1c2A5dmtr","name":"Catty"},{"id":"uKVZvMxhLt","name":"Frank"},{"id":"jAWcE8ooF1","name":"Pancake"},{"id":"gWyGbxF934","name":"Madame Floof"}]}
                console.log("catOne: " + catOne);   // Why does catOne return as 'undefined'? How do I access the nested objects?
                res.body.cats[0].should.have.property('id');
                res.body.cats[0].should.have.property('name','Catty'); // YET THIS WORKS 
            })
            .expect(200, done);
    });
});

describe('GET /cats/:id', function () {
    it('respond with json object containing detailed information on a single cat', function (done) {
        request(appTest)
            .get('/cats/tmk60ux2b')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200, done);
    });
});


describe('GET /cats/:id', function () {
    it('respond with 404 cat id not found - passes the validId check', function (done) {
        request(appTest)
            .get('/cats/oc12C0X3-g')
            .set('Accept', "text/html; charset=utf-8")
            .expect('Content-Type', "text/html; charset=utf-8") 
            .expect(404) 
            .expect(`cat id 'oc12C0X3-g' not found in database`) 
            .end((err) => {
                if (err) return done(err); 
                done();                    
            });
    });

    it('respond with 400 invalid parameter - fails the validId check', function (done) {
        request(appTest)
            .get('/cats/NaN')
            .set('Accept', "text/html; charset=utf-8")
            .expect('Content-Type', "text/html; charset=utf-8") 
            .expect(400) 
            .expect("'NaN' is not a valid shortid") 
            .end((err) => {
                if (err) return done(err); // this error is a TEST ASSERTION ERROR
                done();                    // not the error thrown in our code 
            });
    });
});

// IF you use .end(), .expect() assertions that fail will not throw
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
        request(appTest)
            .put('/cats/tmk60ux2b')
            .send(overdueBirthday)
            .set('Accept', "text/html; charset=utf-8")
            .expect('Content-Type', /json/)  
            .expect(200, done)
    }); 

    it('responds with 400 bad request - age is incorrect format', function (done) {
        request(appTest)
            .put('/cats/tmk60ux2b')
            .send(falseBirthday)
            .set('Accept', "text/html; charset=utf-8")
            .expect('Content-Type', "text/html; charset=utf-8")
            .expect(400, `Error: Invalid ageInYears parameter: "two"`, done)
    });  
})
//  Error: expected 400 "Bad Request", got 500 "Internal Server Error"

describe('DEL /cats/:id', function () {
    it('respond with 204 No Content', function (done) {
        request(appTest)
            .delete('/cats/tmk60ux2b')
            .expect(204, done)
    });

    it('respond with 404 cat id not found', function (done) {
        request(appTest)
            .delete('/cats/oc12C0X3-g')
            .set('Accept', "text/html; charset=utf-8")
            .expect('Content-Type', "text/html; charset=utf-8")
            .expect(`cat id 'oc12C0X3-g' not found in database`) 
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

    const empty = {

    }
    
    it('respond with 201 content created - responds with newly-created cat object with generated id property', function (done) {
        request(appTest)
            .post('/cats')
            .send(body)
            .set('Accept', 'application/x-www-form-urlencoded')
            .expect('Content-Type', /json/)                                    
            .expect(function (res) {
                let object = JSON.stringify(res.body);  
                console.log("object: " + object);    
                res.body.name.should.equal('JimJam');
                res.body.ageInYears.should.equal(5);
                res.body.favouriteToy.should.equal('amazing technicolour dreamcoat');
                res.body.should.have.property('id');
            })
            .expect(201, done)                                              
    })

    it('respond with 400 invalid key', function (done) {
        request(appTest)
            .post('/cats')
            .send(invalidKey)
            .expect(400)
            .expect(`Error: Property 'ears' is invalid`)
            .end((err) => {
                if (err) return done(err); 
                done();                     
            });
    }) 

    it('respond with 400 invalid parameter', function (done) {
        request(appTest)
            .post('/cats')
            .send(invalidParams)
            .set('Accept', "text/html; charset=utf-8")
            .expect('Content-Type', "text/html; charset=utf-8")
            .expect(400,'Error: Invalid ageInYears parameter: "five"', done)
    }) 

    it('respond with 400 invalid object', function (done) {
        request(appTest)
            .post('/cats')
            .send(empty)
            .set('Accept', "text/html; charset=utf-8")
            .expect('Content-Type', "text/html; charset=utf-8")
            .expect(400,'Error: Request data is not a valid object. ', done)
    }) 
})

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