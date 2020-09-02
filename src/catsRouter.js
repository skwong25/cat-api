
const express = require('express');  
const catsRouter = express.Router();

const CatRepository = require('./catsDb.js');

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

// GET route all 
catsRouter.get('', (req, res, next) => {
    const cats = CatRepository.getAllCats();  //should return summary object
    res.json({"cats": cats}); 
});

// GET route by id 
catsRouter.get('/:id', isIdNum, (req, res, next) => {
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
catsRouter.post('', checkObjKeys, checkObjValues, (req, res, next) => {
    const catWithId = CatRepository.addCat(req.object);
    res.status(201).send(catWithId);  
});


// PUT route - allows user to add/update information by id
catsRouter.put('/:id', isIdNum, checkObjKeys, checkObjValues, (req, res, next) => {
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
catsRouter.delete('/:id', isIdNum, (req, res, next) => {
    const isDeleted = CatRepository.deleteCatById(req.id); 
    if (isDeleted) {
        res.status(204).send();
    } else {
        const newError =  new Error(`cat id '${req.id}' not found in database`)
        newError.status = 404;
        return next(newError)
    }
});

module.exports = catsRouter;