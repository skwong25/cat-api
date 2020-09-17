// Breed routers 
// (only contains middleware functions)

// Note: Error handling pattern:
//  const err = validate.generateErr(errMessage); 
//  return next(err); 
// 404 errors take an unfound id param
// 400 errors take an error message param 

const express = require('express');  
const breedsRouter = express.Router();

// imports class instance 
const breedRepository = require('./breedsRepo'); 
const validate = require('./validationFunctions'); 


// checks breed id type 
const isBreedIdNum = (req, res, next) => { 
    console.log('breed id being verified');
    const id = Number(req.params.breedId);                   
    if (id) {   
        req.breedId = id;                                             
        console.log(`breed id ${id} verified as ${typeof id}`);
        next() 
    } else {
        const err = validate.generateErr400(`'${id}' is not a valid id`);
        return next(err); 
    };
}

// checks breed object is populated, has valid keys & values; 
const checkBreedObj = (req, res, next) => {
    const object = req.body;               // { key:value, key:values}
    const keys = Object.keys(object);     // [key, key, key]
    const validKeys = ["name", "description"]; 
    
    let arrayOfFunctions = [validate.checkObjFormat, validate.checkObjKeys, validate.checkObjValues];

    arrayOfFunctions.map((funct) => {
        let message = funct(keys, object, validKeys);
        if (message[0] === "E") {
            const err = validate.generateErr400(message);
            return next(err);
        } else {
            console.log(message);  
        }
    })
    req.object = object; 
    next();
} 

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
        const err = validate.generateErr404(req.breedId);
        return next(err);
    }
})

// DEL breed by id 
breedsRouter.delete('/:breedId', isBreedIdNum, (req, res, next) => {
    const isItDeleted = breedRepository.deleteBreedById(req.breedId); 
    if (isItDeleted) {               
        res.status(204).send();
    } else {
        const err = validate.generateErr404(req.breedId);
        return next(err);
    };
})

// PUT breed by id 
breedsRouter.put('/:breedId', isBreedIdNum, checkBreedObj, (req, res, next) => {
    const isItUpdated = breedRepository.updateBreedById(req.breedId, req.body); 
    if (isItUpdated) {
        res.status(200).send(isItUpdated);
    } else {
        const err = validate.generateErr404(req.breedId);
        return next(err);
    };
})

// POST breed 
breedsRouter.post('/', checkBreedObj, (req, res, next) => { 
    const isItUpdated = breedRepository.addBreed(req.body); 
    if (isItUpdated) {
        console.log("new breed successfully added"); 
        res.status(200).send(isItUpdated); // 201 is NO CONTENT 200 is OK
    } else { 
        const err = validate.generateErr400('Breed could not be added to breed database'); // when would this be triggered? maybe we can get rid of this err handler. 
        return next(err);
    }
})

module.exports = breedsRouter;