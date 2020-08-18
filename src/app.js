// CAT API

const express = require('express');         // imports express lib module
const app = express();                     // express() instantiates app 
const morgan = require('morgan');

const CatRepository = require('./catsDb.js'); // class instance / object  
const breeds = require('./breedsDb.js');
const { deleteCatByIndex } = require('./catsDb.js');


// simple JS function 
const isInvalidString = (value) => {
    if (typeof value === "string") {
        return false;
    } else if (typeof value === "undefined") {
        return false;                     
    };                                   
}
// if value is undefined, then we can let it be ""; 

// simple JS function 
const generateErr = (value) => {
    let message =  `Property value "${value}" is not a valid string`;
    const newError = new Error(message);
    newError.status = 404;
    return newError; 
}

// checks id type 
const isIdNum = (req, res, next) => {
    console.log('id being verified');
    const id = Number(req.params.id);                   // extracts id as a number - returns NaN if it can't 
    if (id) {   
        req.id = id;                                       // Alt: if (typeOf(id) === "number") { ... }        
        console.log('id verified');
        next() 
    } else {
        const newError =  new Error(`cat id '${id}' is not a valid number`)
        newError.status = 404;
        next(newError); 
    };
}

// checks object keys are valid 
const checkObjKeys = (req, res, next) => { 
    const possibleKeys = ["name", "sex", "coat", "description", "breedId"]; 
    const objToCheck = req.query;                // { name: "", sex: "", coat: ""}
    arrayOfKeys = Object.keys(objToCheck);      // Eg: [ "name", "sex", "coat"]
    arrayOfKeys.forEach((key) => { 
        console.log(`checking key: ${key}`)
        const index = possibleKeys.indexOf(key);    // alternative is to use .findByIndex(callback)
        if (index < 0) {
            let message =  `"${key}" is not a valid property`;
            const newError = new Error(message);
            newError.status = 404;
            return next(newError); 
        } else {
        console.log(`key '${key}' verified`)
        }
    });
    console.log('object successfully checked');
    req.object = objToCheck; 
    next();
}

// checks the object values are valid 
const checkObjValues = (req, res, next) => { 
    const objToCheck = req.query;      // { name: "", sex: "", coat: ""}

    if (isInvalidString(objToCheck.name)) {     
        return next(generateErr(objToCheck.name));
    }

    if (isInvalidString(objToCheck.sex)) {
        return next(generateErr(objToCheck.sex));
    }

    if (isInvalidString(objToCheck.coat)) {
        return next(generateErr(objToCheck.coat));
    }

    if (isInvalidString(objToCheck.description)) {
        return next(generateErr(objToCheck.description));
    }

    if (isInvalidString(objToCheck.breed)) {
        return next(generateErr(objToCheck.breed));
    }
    req.object = objToCheck;            
    console.log('object values checked');     
    next();
}

// use app.use('/path', callback) to mount middleware functions (default called on request received) 
const PORT = 4001;

app.use(morgan('tiny'));

// GET route all 
app.get('/cats', (req, res, next) => {
    const cats = CatRepository.getAllCats; // what if cats don't come back - generate error? 
    res.send({"cats": cats}); 
});

// GET route by id 
app.get('/cats/:id', isIdNum, (req, res, next) => {
    const foundCat = CatRepository.getCatById(req.id); 
    if (foundCat) {
        console.log('cat retrieved:' + foundCat);
        res.send(foundCat);
    } else {
        const newError =  new Error(`cat id '${req.id}' not found in database`)
        newError.status = 400;
        return next(newError)
    };
});


// POST route 
app.post('/cats', checkObjKeys, checkObjValues, (req, res, next) => {
    CatRepository.addCat(req.object);
    res.status(201).send("cat successfully added");  
});


// PUT route - allows user to add/update information by id
app.put('/cats/:id', isIdNum, checkObjKeys, checkObjValues, (req, res, next) => {
    const isUpdated = CatRepository.updateCatById(req.id, req.object);             // [ {}, {}, {} ]
    if (isUpdated) {
        console.log(`cat id ${req.id} successfully updated`)
        res.send(isUpdated); // may need to use: res.send(JSON.stringify(updatedCat)); 
    } else {
        const newError = new Error(`cat id '${req.id}' not found in database`);
        newError.status = 400; 
        next(newError); 
    }
});


// DEL route
app.delete('/cats/:id', isIdNum, (req, res, next) => {
    const isDeleted = CatRepository.deleteCatById(req.id); 
    if (isDeleted) {
        res.status(204).send(`cat id ${req.id} successfully deleted`);
    } else {
        const newError =  new Error(`cat id '${req.id}' not found in database`)
        newError.status = 400;
        return next(newError)
    }
});

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
 