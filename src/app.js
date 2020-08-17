// CAT API

const express = require('express');         // imports express lib module
const app = express();                     // express() instantiates app 
const morgan = require('morgan');

const CatRepository = require('./catsDb.js'); // class instance / object  
const breeds = require('./breedsDb.js');

const verifyId = (req, res, next) => {
    console.log('id being verified');
    const catArray = CatRepository.getAllCats;          // catArray = [ {} , {}, {} ]
    const id = req.params.id;                          // id to be verified
    const catIndex = catArray.findIndex(cat => {      // findIndex() iterator 
        return cat.id == id;                         // interchangeable with cat['id']
    }); 
    if (catIndex < 0) {
        const newError =  new Error(`cat id '${id}' not found in database`)
        newError.status = 404;
        next(newError); 
    } else {
        console.log('id verified');
        req.catIndex = catIndex;
        next() 
    };
}

const checkObject = (req, res, next) => { // check all keys are valid 
    const possibleKeys = ["name", "sex", "coat", "description", "breedId"]; 
    const objToCheck = req.query; 
    arrayOfKeys = Object.keys(objToCheck);  // [ "name", "sex", "coat"]
    arrayOfKeys.forEach((key) => { 
        console.log(`checking key: ${key}`)
        const index = possibleKeys.indexOf(key);
        if (index < 0) {
            const newError = new Error(`Key parameter '${key}' is NOT valid`)
            newError.status = 404; 
            next(newError); 
        } else {
        console.log(`key '${key}' verified`)
        }
    });
    console.log('object successfully checked');
    req.object = objToCheck; 
    next();
}

// Add middleware function to rearrange object properties to go in a certain order??
// Add to checkObject to check type of object properties:
// Eg sex to be M or F or NB, name to be string with first letter caps

let nextId = 5;

// set up a port
// app.use('/path', callback) to mount middleware functions (default called on request received) 
const PORT = 4001;

app.use(morgan('tiny'));

// GET request all 
app.get('/cats', (req, res, next) => {
    const cats = CatRepository.getAllCats;
    res.send({"cats": cats}); 
});

// GET request by id 
app.get('/cats/:id', verifyId, (req, res, next) => {
    index = req.catIndex
    const cat = CatRepository.getCatByIndex(index); // {}
    console.log('cat retrieved:' + cat);
    res.send(cat);
});


// POST request  
app.post('/cats', checkObject, (req, res, next) => {
    const catNew = req.object;
    catNew.id = nextId++;                   // returns value of nextId, then increments by 1
    CatRepository.addCat = catNew;
    const newlyAdded = CatRepository.getAllCats.slice(-1);
    res.send(newlyAdded);  
});

/* 
// PUT request - allows user to add/update information by id
app.put('/cats/:id', verifyId, checkObject, (req, res, next) => {
    const catUpdates = req.object;                  // catUpdates to be an object 
    for (let key in catUpdates) {                  // loops to ensure each key-value pair is added 
        let index = req.catIndex;
        cats[index][key] = catUpdates[key]; 
        console.log(cats[index]);
        if (cats[index].hasOwnProperty(key)){      // check and reports back what has been updated 
            console.log(`updated: ${key}: ${cats[index][key]}`);    
        }
    }
    res.send(JSON.stringify(cats[req.catIndex]))    // converts JSON obj into JSON string
});


// DEL request 
app.delete('/cats/:id', verifyId, (req, res, next) => {
    console.log(`Index to be deleted: ${req.catIndex}`);

    const success = atRepository.deleteByIndex(req.catIndex)
    // send an appropriate response

    cats.splice([req.catIndex], 1);
    res.status(204).send('deletion successful');
});
*/

// error-handling to send back error responses 
app.use((err, req, res, next) => {
    let status = err.state || 500  
    let message = err.message; 
    res.status(status).send(message); 
});

// set the server up (listening for reqs)
app.listen(PORT, () => { 
    console.log(`the server is listening for catcalls on port ${PORT}`)
});




// ------- RECAP: -------

// a REST API is representational state transfer 
// server and client are stateless - meaning they are independent 
// REST systems interact through standard operations on resources
// clients send requests, server send responses via HTTP protocol 
// Eg requests consist of HTTP verb, path, header

// -----------------------


// EXTRAS:
// separate cats by breed or location, try a nested router? 
// error handlers - not currently required 
// do we need to use body-parser? NO - when do we need to use this? 
// checks that can also be controlled in the UI:
// breedId is a number 
// coat is specific type
// in PUT requests, if a value is the same, it doesn't need to get updated again
 