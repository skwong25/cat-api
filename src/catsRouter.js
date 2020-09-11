
class CatsRouterClass {
    constructor(catRepository) {
        this.express = require('express');  
        this.shortid = require('shortid');
        this.catsRouter = this.express.Router();         // creates instance of Express router
        this.catRepository = catRepository;

        this.isIdValid = this.isIdValid.bind(this);     
        this.checkObjValues = this.checkObjValues.bind(this); 
        this.checkObject = this.checkObject.bind(this); 
    }
    // Note that methods that contain neighbouring method calls require binding to the class
    
    // SIMPLE JS FUNCTIONS: 
    isInvalidString(value) {
        return typeof value !== "string"                                  
    }
    
    isInvalidNum(value) {  
    return typeof(value) !== "number";  
    }
    
    // 400 - BAD REQUEST
    generateErr400(message) { 
        const newError = new Error(message);
        newError.status = 400; 
        return newError; 
    } 

    // 404 - NOT FOUND
    generateErr404(id) {
        let message = `cat id '${id}' not found in database`
        const newError = new Error(message);
        newError.status = 404; 
        return newError; 
    }

    // checks for a populated object 
    checkObjFormat(keys) {
        let message = (keys.length !== 0) ? 
            'Check successful - request data verified as valid object' : 'Error: Request data is not a valid object. ' 
        return message; 
    } 

    // checks for valid keys 
    checkObjKeys(keys) {
        const validKeys = ["name", "ageInYears", "favouriteToy", "description", "breedId"];
        let invalidKeys = keys.filter(key => { 
            return !validKeys.includes(key)
        })
        let message = (invalidKeys.length === 0) ? 'Check successful - object keys valid' : `Error: Property '${invalidKeys[0]}' is invalid` ;
        return message;  
    }

    // checks for valid property values  
    checkObjValues (keys, object) {  
        let isError = [];
        keys.forEach((key) => {
            let value = object[key]; 
            let invalidParam = (key === "ageInYears") ? this.isInvalidNum(value) : this.isInvalidString(value);
            if (invalidParam === true) {  
                isError.push(`Error: Invalid ${key} parameter: "${value}"`)
            }  
        })      
        let message = isError[0] || 'Check successful - object property values valid';
        return message; 
    }

    // MIDDLEWARE FUNCTIONS: 
    // checks if id is a valid shortid                          
    isIdValid(req, res, next) {  

        let id = req.params.id; 
        console.log(`id '${id}'' being verified`);
        
        if (this.shortid.isValid(id)) {   
            req.id = id;                                             
            console.log('id verified as valid shortid');
            next() 
        } else {
            const err = this.generateErr400(`'${id}' is not a valid shortid`);
            next(err); 
        };
    }

    // consolidates Object checks 
    checkObject(req, res, next) { 

        const object = req.body;  // JSON bodyparses attaches parsed object to req.body so no need to check: typeof object === "object" 
        const keys = Object.keys(object);
        let arrayOfFunctions = [this.checkObjFormat, this.checkObjKeys, this.checkObjValues];

        arrayOfFunctions.forEach((funct) => { 
            let message = funct(keys, object);

            if (message[0] === "E") {
                next(this.generateErr400(message))
            } else {
                console.log(message);
            };
        });

    req.object = object;         
    next()
    }
    
    initializeRoutes () {

        // GET route all 
        this.catsRouter.get('/', (req, res, next) => {  
            const cats = this.catRepository.getAllCats();  
            res.json({"cats": cats}); 
        });

        // GET route by id 
        this.catsRouter.get('/:id', this.isIdValid, (req, res, next) => {  
            // getCatById returns cat object or null 
            const foundCat = this.catRepository.getCatById(req.id);         
            if (foundCat) { 
                console.log('cat retrieved:' + foundCat);
                res.send(foundCat);
            } else {
                return next(this.generateErr404(req.id))
            }
        });

        // POST route 
        this.catsRouter.post('/', this.checkObject, (req, res, next) => {   
            const catWithId = this.catRepository.addCat(req.object); 
            res.status(201).send(catWithId);  
        });

        // PUT route - allows user to add/update information by id
        this.catsRouter.put('/:id', this.isIdValid, this.checkObject, (req, res, next) => {
            // updateCatById returns updated cat object or null 
            const isUpdated = this.catRepository.updateCatById(req.id, req.object);            
            if (isUpdated) {
                console.log(`cat id '${req.id}' successfully updated`)
                res.send(isUpdated); 
            } else {
                return next(this.generateErr404(req.id))
            }
        });

        // DEL route
        this.catsRouter.delete('/:id', this.isIdValid, (req, res, next) => {
            // updateCatById returns updated cat object or null 
            const isDeleted = this.catRepository.deleteCatById(req.id); 
            if (isDeleted) {
                res.status(204).send(); // 204 NO CONTENT 
            } else {
                return next(this.generateErr404(req.id))
            }
        });
    }
} 

module.exports.router = CatsRouterClass; 
// export a class by attaching it as a property of the module.exports object 