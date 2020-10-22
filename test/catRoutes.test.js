// ids:
// {"cats":[{"id":"1c2A5dmtr","name":"Catty"},{"id":"uKVZvMxhLt","name":"Frank"},{"id":"jAWcE8ooF1","name":"Pancake"},{"id":"gWyGbxF934","name":"Madame Floof"}]}

const request = require('supertest');
const should = require('should');

const buildServer = require('../src/app'); 
const appTest = buildServer();

//==================== user API tests ====================

describe('GET /cats', function () {
    it('responds with a json object containing a list of cats with id & name properties only', function (done) {
        request(appTest)
            .get('/cats')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(function (res) {
                let object = JSON.stringify(res.body); // Note that this parsing from JSON to JS object - only allows us to console log result 
                console.log("object: " + object);    // {"cats":[{"id":"1c2A5dmtr","name":"Catty"},{"id":"uKVZvMxhLt","name":"Frank"},{"id":"jAWcE8ooF1","name":"Pancake"},{"id":"gWyGbxF934","name":"Madame Floof"}]}
                res.body.cats[0].should.have.property('id');
                res.body.cats[0].should.have.property('name','Catty');
            })
            .expect(200)
            .end((err) => {
                if (err) return done(err); 
                done(); 
            })      
    });
});

describe('GET /cats/:id', function () {
    it('respond with json object containing detailed information on a single cat', function (done) {
        request(appTest)
            .get('/cats/1c2A5dmtr')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err) => {
                if (err) return done(err); 
                done(); 
            })    
    });
});


describe('GET /cats/:id', function () {
    it('respond with 404 id not found', function (done) {
        request(appTest)
            .get('/cats/oc12C0X3-g')
            .set('Accept', "text/html; charset=utf-8")
            .expect('Content-Type', "text/html; charset=utf-8") 
            .expect(404) 
            .expect(`id 'oc12C0X3-g' not found in database`) 
            .end((err) => {
                if (err) return done(err); 
                done();                    
            });
    });

    //  tests fail case of isIdValid()
    it('respond with 400 invalid shortid', function (done) {
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

    it('responds with 200  - successfully updates records', function (done) {
        request(appTest)
            .put('/cats/1c2A5dmtr')
            .send(overdueBirthday)
            .set('Accept', "text/html; charset=utf-8")
            .expect('Content-Type', /json/)  
            .expect(200)
            .end((err) => {
                if (err) return done(err); 
                done(); 
            })    
    }); 

    it('responds with 404 not found', function (done) {
        request(appTest)
            .put('/cats/oc12C0X3-g')
            .send(overdueBirthday)
            .set('Accept', "text/html; charset=utf-8")
            .expect('Content-Type', "text/html; charset=utf-8")
            .expect(404, `id 'oc12C0X3-g' not found in database`)
            .end((err) => {
                if (err) return done(err); 
                done(); 
            })    
    });  
})

describe('DEL /cats/:id - successfully deletes record', function () {
    it('respond with 204 no content', function (done) {
        request(appTest)
            .delete('/cats/1c2A5dmtr')
            .expect(204)
            .end((err) => {
                if (err) return done(err); 
                done(); 
            })    
    });

    it('respond with 404 id not found', function (done) {
        request(appTest)
            .delete('/cats/oc12C0X3-g')
            .set('Accept', "text/html; charset=utf-8")
            .expect('Content-Type', "text/html; charset=utf-8")
            .expect(404, `id 'oc12C0X3-g' not found in database`)
            .end((err) => {
                if (err) return done(err); 
                done(); 
            })    
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
    
    it('respond with 201 content created - successfully creates new cat object with new id', function (done) {
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
            .expect(201)   
            .end((err) => {
                if (err) return done(err); 
                done(); 
            })                                              
    })

    // tests all fail cases of checkObject()
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
            .expect(400,'Error: Invalid ageInYears parameter: "five"')
            .end((err) => {
                if (err) return done(err); 
                done(); 
        }) 
    })

    it('respond with 400 invalid object', function (done) {
        request(appTest)
            .post('/cats')
            .send(empty)
            .set('Accept', "text/html; charset=utf-8")
            .expect('Content-Type', "text/html; charset=utf-8")
            .expect(400,'Error: Request data is not a valid object. ')
            .end((err) => {
                if (err) return done(err); 
                done(); 
            })           
    })
})
  
