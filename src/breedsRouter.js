// TODO provide DEL, POST, PUT routes also. 

const express = require('express');  
const breedsRouter = express.Router();

// imports class instance 
const breedRepository = require('./breedsRepo'); 

const isInvalidString = (value) => {
    return typeof value !== "string"                                  
}

const isInvalidNum = (value) => {   // 
    return typeof(value) !== "number";                              
}

// checks breed id type 
const isBreedIdNum = (req, res, next) => {
    console.log('breed id being verified');
    const id = Number(req.params.breedId);                   
    if (id) {   
        req.breedId = id;                                             
        console.log(`breed id ${id} verified as ${typeof id}`);
        next() 
    } else {
        const newError =  new Error(`'${id}' is not a valid number`)
        newError.status = 400;
        next(newError); 
    };
}

// checks keys are valid 
const checkBreedKeys = (req, res, next) => {
    const breedObjToCheck = req.body                        // bodyParser auto attaches JSON object to req.body
    const validKeys = ["breedId", "name", "description"];
    const arrayOfKeys = Object.keys(breedObjToCheck);

    for (let i = 0; i<arrayOfKeys; i++) {
        if (!validKeys.includes(arrayOfKeys[i])) {
            const newError = new Error(`'${arrayOfKeys[i]}' is not a valid key`); 
        };
    }
    console.log("object keys checked")
    next();
}

// checks object property values are valid 
const checkBreedValues = (req, res, next) => {

    const objToCheck = req.body;      
    for (let key in objToCheck) {
        if (key === "breedId") {
            if (isInvalidNum(objToCheck.ageInYears)) { 
                console.log(`invalid number value: ${objToCheck[key]}`);
                return next(generateErr(objToCheck[key]));
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
} // TODO Review if we can use same code as in catsRouter with diff parameters? Maybenot

// GET route all 
breedsRouter.get('/', (req, res, next) => {
    const breeds = breedRepository.getAllBreeds; // this returns an array of objects
    res.json({"breeds": breeds}); 
})

// GET breed by id
breedsRouter.get('/:breedId', isBreedIdNum, (req, res, next) => {
    const foundBreed = breedRepository.getBreedById(req.breedId);  
    if (foundBreed) {  
        res.send(foundBreed); 
    } else {
        const newError = new Error(`breed id '${req.breedId}' not found in database`);
        newError.status = 404;
        return next(newError);
    }
})

// DEL breed by id 
breedsRouter.delete('/:breedId', isBreedIdNum, (req, res, next) => {
    const isItDeleted = breedRepository.deleteBreedById(req.breedId); 
    if (isItDeleted) {              // deleteBreedById should return a truth or if it can't find the id, returns false 
        res.status(204).send();
    } else {
        const newError = new Error(`breed id '${req.breedId}' not found in database`);
        newError.status = 400;
        return next(newError);
    };
})

// PUT breed by id 
breedsRouter.put('/:breedId', isBreedIdNum, checkBreedKeys, checkBreedValues, (req, res, next) => {
    const isItUpdated = breedRepository.updateBreedById(req.breedId, req.body); // req.breedId = 1
    if (isItUpdated) {
        res.status(200).send(isItUpdated);
    } else {
        const newError = new Error(`breed id '${req.breedId}' not found in database`);
        newError.status = 400; // 400 is BAD REQUEST
        return next(newError);
    };
})

// POST breed 
breedsRouter.post('/', checkBreedKeys, checkBreedValues, (req, res, next) => { // Checks keys (of req.body) are valid data type and acceptable parameters?  
    const isItUpdated = breedRepository.addBreed(req.body); 
    if (isItUpdated) {
        console.log("new breed successfully added");
        res.status(201).send(); // 201 is NO CONTENT 
    } else { 
        const newError = new Error('Breed could not be added to breed database - check data format');
        newError.status = 404;
        return next(newError);
    }
})

module.exports = breedsRouter;