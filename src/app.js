// CAT API

const cats = require('./catsDb.js');
const breeds = require('./breedsDb.js');

const express = require('express');         // imports express lib module
const app = express();                     // express() instantiates app 
const morgan = require('morgan');

const verifyId = (req, res, next) => {
    const catInQuestion = req.params.id;
    const catIndex = cats.findIndex(cat => {     // findIndex() iterator 
        return cat.id == catInQuestion;         // interchangeable with cat['id']
    }); 
    if (catIndex !== -1) {
        req.catIndex = catIndex;
        next()
    } else {
        res.status(404).send('cat does not exist in this database');
    };
}

const checkObject = (req, res, next ) => {
    if (req.query) {
        next()
    } else {
        res.status(404).send('invalid information provided')
    }
}

let nextId = 5;

// set up a port
// app.use('/path', callback) to mount middleware functions (default called on request received) 
const PORT = 4001;

app.use(morgan('tiny'));

// GET request all 
app.get('/cats', ( req, res, next ) => {
    res.send(cats)
});

// GET request by id 
app.get('/cats/:id', verifyId, ( req, res, next ) => {
    res.send(cats[req.catIndex]);
});

// POST request  
app.post('/cats', checkObject, ( req, res, next ) => {
    const catNew = req.query;
    catNew.id = nextId++;              // returns value of nextId, then increments by 1
    cats.push(catNew);
    const lastAdded = cats.slice(-1); // extracts last element to check object added to the array
    res.send(lastAdded);  
});

// PUT request - allows user to add/update information by id
app.put('/cats/:id', verifyId, checkObject, ( req, res, next ) => {
    const catUpdates = req.query;                  // catUpdates to be an object 
    for (let key in catUpdates) {                  // loops to ensure each key-value pair is added 
        let index = req.catIndex
        console.log(`Index: ${index} , Key: ${key} `);
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
    cats.splice([req.catIndex], 1);
    res.status(204).send('deletion successful');
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
 