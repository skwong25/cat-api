// CAT API

const express = require('express');         // imports express lib module
const app = express();                     // express() instantiates app 
const morgan = require('morgan');
const bodyParser = require('body-parser')

const CatRepository = require('./catsDb.js'); // class instance / object  
const breeds = require('./breedsDb.js');
const { deleteCatByIndex } = require('./catsDb.js');

app.use(express.json());
// app.use(bodyParser.urlencoded({extended: true})); // if we have this, we should send data as urlencoded in Postman 
app.use(bodyParser.json()) // automatically attaches parsed JSON object to req.body - should send data as raw in Postman

// simple JS function 
const isInvalidString = (value) => {
    return typeof value !== "string"                                  
}

const isInvalidSex = (value) => {
    const genders = ['M', 'F', 'N'];
    return !genders.includes(value);                                 
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

// checks object keys  
const checkObjKeys = (req, res, next) => {  

    const possibleKeys = ["name", "sex", "coat", "description", "breed"];

    function keyNotPresent (key) { 
        console.log(`is ${key} present?`)
        return !possibleKeys.includes(key) // returns true if key is NOT one of the possibleKeys
    }

    const objToCheck = req.body;                // { name: "", sex: "", coat: ""}
    console.log(objToCheck);
    const arrayOfKeys = Object.keys(objToCheck);      // Eg: [ "name", "sex", "coat"]
    console.log(arrayOfKeys);

    if (arrayOfKeys.length < 1) {
        const newError = new Error('no parameters provided');
        newError.status = 404;
        return next(newError);
    }

    let invalidKey = arrayOfKeys.filter(keyNotPresent); // returns an array of elements that meet the criteria 

    if (invalidKey[0]) { 
        console.log(`Property '${invalidKey[0]}' is invalid`);
        const newError = new Error(`Property '${invalidKey[0]}' is invalid`);
        newError.status = 400;
        return next(newError);
    } else {
        console.log('object keys checked'); 
        req.object = objToCheck; 
        next();
    }
}

// checks object values 
const checkObjValues = (req, res, next) => { 
    const objToCheck = req.body;      // { name: "", sex: "", coat: ""}

    for (let key in objToCheck) {
        if (key === "sex") {
            if (isInvalidSex(objToCheck.sex)) { 
                console.log('invalid sex parameter');
                return next(generateErr(objToCheck.sex));
            } 
        } else {
            if (isInvalidString(objToCheck[key])) { 
                console.log(`invalid ${key} parameter: ${objToCheck[key]}`);
                return next(generateErr(objToCheck[key]));
            } 
        };
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
