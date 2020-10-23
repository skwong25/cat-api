// Breed routers (only contains middleware functions)

// Note on middleware and error-handling parameters: 
// MIDDLEWARE FUNCTIONS PATTERN: Execution ends with next() or next(err) 
// ERROR HANDLING PATTERN: 404 errors take an 'unfound id' param // 400 errors take an 'error message' param
// const err = validate.generateErr404(id); 
// const err = validate.generateErr400(errMessage); 

class BreedsRouter {
    constructor (breedsRepository) {
        this.express = require('express');  
        this.breedsRouter = this.express.Router();   // creates instance of a router, router path mounted in app.js 
        this.breedsRepository = breedsRepository;    //  breedsRepository is passed argument on class instantiation 
        this.validate = require('./validationFunctions');

        this.isBreedIdNum = this.isBreedIdNum.bind(this);     
        this.checkBreedObj = this.checkBreedObj.bind(this); 

        // Note that methods that are CALLED or CONTAIN neighbouring methods require binding to the class 
    }

    // checks breed id type 
    isBreedIdNum(req, res, next) { 
        console.log('breed id being verified');
        const id = Number(req.params.breedId);                   
        if (id) {   
            req.breedId = id;                                             
            console.log(`breed id ${id} verified as ${typeof id}`);
            next() 
        } else {
            const err = this.validate.generateErr400(`'${id}' is not a valid id`);
            return next(err); 
        };
    }

    // checks that the breed object is populated, has valid keys & values; 
    checkBreedObj(req, res, next) {
        const object = req.body;               // { key:value, key:values}
        const keys = Object.keys(object);     // [key, key, key]
        const validKeys = ["name", "description"]; 
        
        let arrayOfFunctions = [this.validate.checkObjFormat, this.validate.checkObjKeys, this.validate.checkObjValues];

        arrayOfFunctions.map((funct) => {
            let message = funct(keys, object, validKeys);
            if (message[0] === "E") {
                const err = this.validate.generateErr400(message);
                return next(err);
            } else {
                console.log(message);  
            }
        })
        req.object = object; 
        next();
    } 

    initializeRoutes() {

        // note that we re-declare variables to allow access to class methods within the local scope 
        // alternative solutions tested:
        // tried to bind this.breedsRepository in the constructor: 'TypeError: this.breedsRepository.bind is not a function'
        // tried also to bind this.breedsRouter in the constructor but it could not access this.breedsRepository or this.validate still

        let breedsRepository = this.breedsRepository; 
        let validate = this.validate; 

        this.breedsRouter.get('/', async function (req, res, next) {

            try {
                const breeds = await breedsRepository.getAllBreeds(); // this returns an array of objects
                console.log(breeds);  
                res.json({breeds: breeds});
            } catch (err) {
                next(err); 
            };
        })

        // GET breed by id
        this.breedsRouter.get('/:breedId', this.isBreedIdNum, async function (req, res, next) { 
            try { 
                const foundBreed = await breedsRepository.getBreedById(req.breedId);  
                if (foundBreed) {  
                    res.send(foundBreed); 
                } else {
                    const err = validate.generateErr404(req.breedId);
                    return next(err);
                }
            } catch (err) {
                next(err);
            };
        })

        // DEL breed by id 
        this.breedsRouter.delete('/:breedId', this.isBreedIdNum, async function (req, res, next) {
            try {
                const isItDeleted = await breedsRepository.deleteBreedById(req.breedId); 
                if (isItDeleted) {               
                    res.status(204).send();
                } else {
                    const err = validate.generateErr404(req.breedId);
                    return next(err);
                };
            } catch (err) {
                next(err);
            };
        })

        // PUT breed by id 
        this.breedsRouter.put('/:breedId', this.isBreedIdNum, this.checkBreedObj, async function (req, res, next) {
            try {
                const isItUpdated = await breedsRepository.updateBreedById(req.breedId, req.object); 
                if (isItUpdated) {
                    res.status(200).send(isItUpdated);
                } else {
                    const err = validate.generateErr404(req.breedId);
                    return next(err);
                };
            } catch (err) {
                next(err);
            };
        })

        // POST breed 
        this.breedsRouter.post('/', this.checkBreedObj, async function (req, res, next) { 
            try {
                const isItUpdated = await breedsRepository.addBreed(req.object); 
                if (isItUpdated) {
                    console.log("new breed successfully added"); 
                    res.status(201).send(isItUpdated); 
                } else { 
                    const err = validate.generateErr400('Breed could not be added to breed database');  
                    return next(err);
                }
            } catch (err) {
                next(err);
            };
        })
    }
}

module.exports.router = BreedsRouter;
// export a class by attaching it as a property of the module.exports object 