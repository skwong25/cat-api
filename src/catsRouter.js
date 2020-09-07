
const express = require('express');  
const catsRouter = express.Router();

const shortid = require('shortid');

const importObject = require('./catsDb'); // note that module.exports = {catClass: CatClass}
const CatClass = importObject.catClass; 
const catRepository = new CatClass(shortid.generate);  // class instantiation

// simple JS function 
const isInvalidString = (value) => {
    return typeof value !== "string"                                  
}

const isInvalidNum = (value) => {
    return typeof(value) !== "number";                              
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

// checks object data format
const checkObjFormat = (req, res, next) => {
    const objectConstructor = ({}).constructor;
    if (req.body.constructor === objectConstructor) {
        console.log("verified request data is an object")
        next();
    } else {
        const newError = new Error ('Request data is not an object - check format');
        newError.status = 400;
        return next(newError);
    }
}

// checks object keys  
const checkObjKeys = (req, res, next) => {  

    const validKeys = ["name", "ageInYears", "favouriteToy", "description", "breedId"];

    function keyNotPresent (key) { 
        console.log(`is ${key} present?`)
        return !validKeys.includes(key) // returns true if key is NOT one of the possibleKeys
    }

    const objToCheck = req.body;                
    console.log(objToCheck);
    const arrayOfKeys = Object.keys(objToCheck);      
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
} // FIXME this seems convoluted just to check if an object key is valid

// checks object values 
const checkObjValues = (req, res, next) => { 
    const objToCheck = req.body;      // { name: "", ageInYears: "", favouriteToy: ""}

    for (let key in objToCheck) {
        if (key === "ageInYears") {
            if (isInvalidNum(objToCheck.ageInYears)) { 
                console.log(`invalid age value: ${objToCheck.ageInYears}`);
                return next(generateErr(objToCheck.ageInYears));
            } 
        } else {
            if (isInvalidString(objToCheck[key])) { 
                console.log(`invalid ${key} value: ${objToCheck[key]}`);
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
    const cats = catRepository.getAllCats();  //should return summary object
    res.json({"cats": cats}); 
});

// GET route by id 
catsRouter.get('/:id', isIdNum, (req, res, next) => {
    const foundCat = catRepository.getCatById(req.id); 
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
catsRouter.post('', checkObjFormat, checkObjKeys, checkObjValues, (req, res, next) => {
    const catWithId = catRepository.addCat(req.object);
    res.status(201).send(catWithId);  
});


// PUT route - allows user to add/update information by id
catsRouter.put('/:id', isIdNum, checkObjFormat, checkObjKeys, checkObjValues, (req, res, next) => {
    const isUpdated = catRepository.updateCatById(req.id, req.object);             // [ {}, {}, {} ]
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
    const isDeleted = catRepository.deleteCatById(req.id); 
    if (isDeleted) {
        res.status(204).send();
    } else {
        const newError =  new Error(`cat id '${req.id}' not found in database`)
        newError.status = 404;
        return next(newError)
    }
});

module.exports = catsRouter;