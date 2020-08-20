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
    } else {
        return true;                     
    };                                   
}
// if value is undefined, then we can let it be ""; 

const isInvalidSex = (value) => {
    if (value !== 'M' || 'F') {
        return false;
    } else {
        return true;                     
    };                                   
}

// simple JS function 
const generateErr = (value) => {
    let message =  `Invalid parameter: '${value}'`;
    const newError = new Error(message);
    newError.status = 400;
    return newError; 
}

// checks id type 
const isIdNum = (req, res, next) => {
    console.log('id being verified');
    const id = Number(req.params.id);                   
    if (id) {   
        req.id = id;                                       // Alt: if (typeOf(id) === "number") { ... }        
        console.log('id verified');
        next() 
    } else {
        const newError =  new Error(`'${id}' is not a valid number`)
        newError.status = 400;
        next(newError); 
    };
}

// checks object keys are valid 
const checkObjKeys = (req, res, next) => {  

    const possibleKeys = ["name", "sex", "coat", "description", "breed"];

    function isKeyPresent (key) { 
        console.log(`is ${key} present?`)
        return possibleKeys.includes(key)
    }

    const objToCheck = req.query;                // { name: "", sex: "", coat: ""}
    console.log(objToCheck);
    arrayOfKeys = Object.keys(objToCheck);      // Eg: [ "name", "sex", "coat"]
    console.log(arrayOfKeys);

    if (!arrayOfKeys.every(isKeyPresent)) {
        console.log(`One or more property is invalid`);
        let message =  `One or more property is invalid`;
        const newError = new Error(message);
        newError.status = 404;
        return next(newError);
    } else {
        console.log('object keys checked'); 
        req.object = objToCheck; 
        next();
    }
}

// checks the object values are valid 
const checkObjValues = (req, res, next) => { 
    const objToCheck = req.query;      // { name: "", sex: "", coat: ""}

    if (objToCheck.name && isInvalidString(objToCheck.name)) { 
        return next(generateErr(objToCheck.name));
    } 

    if (objToCheck.sex && isInvalidSex(objToCheck.sex)) {
        return next(generateErr(objToCheck.sex));
    } 

    if (objToCheck.coat && isInvalidString(objToCheck.coat)) {  
        return next(generateErr(objToCheck.coat));
    }

    if (objToCheck.description && isInvalidString(objToCheck.description)) {
        return next(generateErr(objToCheck.description));
    }

    if (objToCheck.breed && isInvalidString(objToCheck.breed)) {
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
    res.json({"cats": cats}); 
});

// GET route by id 
app.get('/cats/:id', isIdNum, (req, res, next) => {
    const foundCat = CatRepository.getCatById(req.id); 
    if (foundCat) {
        console.log('cat retrieved:' + foundCat);
        res.send(foundCat);
    } else {
        const newError =  new Error(`cat id '${req.id}' not found in database`)
        newError.status = 404;
        return next(newError)
    };
});


// POST route 
app.post('/cats', checkObjKeys, checkObjValues, (req, res, next) => {
    const catWithId = CatRepository.addCat(req.object);
    res.status(201).send(catWithId);  
});


// PUT route - allows user to add/update information by id
app.put('/cats/:id', isIdNum, checkObjKeys, checkObjValues, (req, res, next) => {
    const isUpdated = CatRepository.updateCatById(req.id, req.object);             // [ {}, {}, {} ]
    if (isUpdated) {
        console.log(`cat id '${req.id}' successfully updated`)
        res.send(isUpdated); // may need to use: res.send(JSON.stringify(updatedCat)); 
    } else {
        const newError = new Error(`cat id '${req.id}' not found in database`);
        newError.status = 404; 
        next(newError); 
    }
});


// DEL route
app.delete('/cats/:id', isIdNum, (req, res, next) => {
    const isDeleted = CatRepository.deleteCatById(req.id); 
    if (isDeleted) {
        res.status(204).send();
    } else {
        const newError =  new Error(`cat id '${req.id}' not found in database`)
        newError.status = 404;
        return next(newError)
    }
});

// error-handling sends back error responses 
app.use((err, req, res, next) => {
    let status = err.status || 500  
    let message = err.message || 'test message'
    res.status(status).send(message); 
});

// sets server up (listening for reqs)
app.listen(PORT, () => { 
    console.log(`the server is listening for catcalls on port ${PORT}`)
});

module.exports = app




// EXTRAS:
// separate cats by breed or location, try a nested router? 
// error handlers - not currently required 
// do we need to use body-parser? NO - when do we need to use this? 
// checks that can also be controlled in the UI:
// breedId is a number 
// coat is specific type
// in PUT requests, if a value is the same, it doesn't need to get updated again
