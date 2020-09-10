
class CatsRouterClass {
    constructor(catRepository) {
        this.express = require('express');  
        this.shortid = require('shortid');
        this.catsRouter = this.express.Router();         // creates instance of Express router
        this.catRepository = catRepository;

        this.isIdValid = this.isIdValid.bind(this);     
        this.checkObjValues = this.checkObjValues.bind(this); 
    }
    // Note that methods that contain neighbouring method calls require binding to the class
    
    isInvalidString (value) {
        return typeof value !== "string"                                  
    }
    
    isInvalidNum (value) {  
    return typeof(value) !== "number";                              
    }
    
    // 400 - BAD REQUEST
    generateErr400 (message) { 
        const newError = new Error(message);
        newError.status = 400; 
        return newError; 
    } 

    // 404 - NOT FOUND
    generateErr404 (id) {
        let message = `cat id '${id}' not found in database`
        const newError = new Error(message);
        newError.status = 404; 
        return newError; 
    }
    
    // checks if id is a valid shortid                          
    isIdValid (req, res, next) {  

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

    // checks object data format
    checkObjFormat (req, res, next) { 
        const objectConstructor = ({}).constructor;  
        if (req.body.constructor === objectConstructor) {  
            console.log("verified request data is an object");
            next();
        } else {
            const err = this.generateErr400('Request data is not an object - check format');
            next(err); 
        }
    }

    // checks object keys  
    checkObjKeys (req, res, next) {  
        
        const validKeys = ["name", "ageInYears", "favouriteToy", "description", "breedId"];
        
        function keyNotPresent (key) { 
            console.log(`is ${key} present?`)
            return !validKeys.includes(key) // returns true if key is NOT one of the possibleKeys
        }
        
        const objToCheck = req.body;                
        console.log("Checking object: " + objToCheck);
        const arrayOfKeys = Object.keys(objToCheck);      
        console.log("The keys to check: " + arrayOfKeys);
        
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
    checkObjValues (req, res, next) { 
        const object = req.body;      // Eg: { name: "", ageInYears: "", favouriteToy: ""}
        
        for (let key in object) {
            let value  = object[key];

            let invalidParam = (key === "ageInYears") ? this.isInvalidNum(value) : this.isInvalidString(value); 
            if (invalidParam) {
                const err = this.generateErr400(`Invalid ${key} parameter: "${value}"`);
                next(err); 
            }  // refactored to reduce repetition of generateErr() function calls 
        }

        req.object = object;            
        console.log('object values checked');     
        next();
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
        this.catsRouter.post('/', this.checkObjFormat, this.checkObjKeys, this.checkObjValues, (req, res, next) => {   // TODO: we can combine 3 x checks into one for simplicity
            const catWithId = this.catRepository.addCat(req.object); 
            res.status(201).send(catWithId);  
        });

        // PUT route - allows user to add/update information by id
        this.catsRouter.put('/:id', this.isIdValid, this.checkObjFormat, this.checkObjKeys, this.checkObjValues, (req, res, next) => {
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