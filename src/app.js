// CAT API
// allows CRUD functionality, databases sold seperately 

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
    // parse object to return JSON object attached to req.body 
    // not sure yet if I have to parse or data is accesible via req.query... 
}

// set up a port
// app.use('/path', callback) to mount middleware functions (default called on request received) 
const PORT = 4001;

app.use(morgan('tiny'));

console.log(`test: ${cats}`);
console.log(`test: ${breeds}`);

// GET request all 
app.get('/cats', ( req, res, next ) => {
    res.send(cats)
});

// GET request by id 
app.get('/cats/:id', verifyId, ( req, res, next ) => {
        res.send(cats[req.catIndex]);
});

// POST request  
app.post('/cats', ( req, res, next ) => {
    if (req.query.name) {
        const newCat = req.query;
        const lastId = cats[-1]["id"];
        newCat.id = lastId++;
        cats.push(newCat);
        const lastAdded = cats.slice(-1); // extracts last element to check object has added to the array
        res.send(lastAdded); 
    } else {
        res.status(404).send('incomplete info')
    }
});

// PUT request  
app.put('/cats/:id', verifyId, ( req, res, next ) => {
        if (req.query.name && req.query.descrip) { // write middleware function to extract object check 
            const catUpdates = res.query; 
            cats[req.catIndex] = catUpdates;
        } else { 
            res.status(404).send('incomplete info')
        } 
});

// DEL request 
app.delete('/cats/:id', verifyId,  (req, res, next) => {
        cats.splice(req.catIndex,1);
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


// EXTRAS: we can write error handlers 
// separate cats by breed, try a nested router? 
// separate out the indexChecker into a middleware function 
// use morgan logger
// do we need to use body-parser?
 