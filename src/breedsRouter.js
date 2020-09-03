
const express = require('express');  
const breedsRouter = express.Router();

const BreedRepository = require('./breedsDb.js');

// checks breed id type 
const isBreedId = (req, res, next) => {
    console.log('breed id being verified');
    const id = Number(req.params.breedId);                   
    if (id) {   
        req.breedId = id;                                             
        console.log('breed id verified');
        next() 
    } else {
        const newError =  new Error(`'${id}' is not a valid number`)
        newError.status = 400;
        next(newError); 
    };
}

// GET route all 
breedsRouter.get('', (req, res, next) => {
    const breeds = BreedRepository.getAllBreeds; // this returns an array of objects
    res.json({"breeds": breeds}); 
})

// GET breed by id
breedsRouter.get('/:breedId', isBreedId, (req, res, next) => {
    const foundBreed = BreedRepository.getBreedById(req.breedId); 
    if (foundBreed) {  
        res.send(foundBreed); // TODO - in the test, can we expect this to be an object? 
    } else {
        const newError = new Error(`breed id '${req.breedId}' not found in database`)
        newError.status = 404;
        return next(newError) 
    }
})

module.exports = breedsRouter;