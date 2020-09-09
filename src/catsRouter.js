
class CatsRouterClass {
    constructor(catRepository) {
        this.express = require('express');  
        this.shortid = require('shortid');
        this.catsRouter = this.express.Router();         // creates instance of Express router
        this.catRepository = catRepository;

        this.isIdValid = this.isIdValid.bind(this); // Note that methods that contain neighbouring method calls require binding to the class
        this.checkObjValues = this.checkObjValues.bind(this); 
    }
    
    isInvalidString (value) {
        return typeof value !== "string"                                  
    }
    
    isInvalidNum (value) {   // 
    return typeof(value) !== "number";                              
    }
    
    generateErr (key, value) {
        let message =  `Invalid ${key} parameter: "${value}"`;
        const newError = new Error(message);
        newError.status = 400;
        return newError; 
    }
    
    // checks if id is a valid shortid                          
    isIdValid (req, res, next) {       
        console.log('id being verified');

        if (this.shortid.isValid(req.params.id)) {   
            req.id = req.params.id;                                             
            console.log('id verified');
            next() 
        } else {
            const newError =  new Error(`'${req.params.id}' is not a valid shortid`)
            newError.status = 400;
            next(newError); 
        };
    }

    // checks object data format
    checkObjFormat (req, res, next) { 
        const objectConstructor = ({}).constructor; // in strict mode, 'this' in functions is undefined. 
        if (req.body.constructor === objectConstructor) { // within methods, 'this' refers to the object the method is owned by. 
            console.log("verified request data is an object") // this does not apply to nested functions, where you declare a function within an object's method
            next();
        } else {
            const newError = new Error ('Request data is not an object - check format');
            newError.status = 400;
            return next(newError);
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
        const objToCheck = req.body;      // { name: "", ageInYears: "", favouriteToy: ""}
        
        for (let key in objToCheck) {
            if (key === "ageInYears") {
                if (this.isInvalidNum(objToCheck.ageInYears)) {  // if the age is an invalid Number 
                    console.log(`we have encountered invalid number: ${objToCheck[key]}`);
                    return next(this.generateErr(key, objToCheck[key])); 
                } 
            } else {
                const b = this.isInvalidString(objToCheck[key])
                if (b) {  // it has an issue 
                    console.log(`we have encountered invalid ${key} value: ${objToCheck[key]}`);
                    return next(this.generateErr(objToCheck[key]));
                } 
            };
        }
        
        req.object = objToCheck;            
        console.log('object values checked');     
        next();
    }
    
    initializeRoutes () {
        // GET route all 
        this.catsRouter.get('/', (req, res, next) => {   // In arrow functions this. contetxt uses the enclosing parent context
            const cats = this.catRepository.getAllCats();  
            res.json({"cats": cats}); 
        });

        // GET route by id 
        this.catsRouter.get('/:id', this.isIdValid, (req, res, next) => {  
            const foundCat = this.catRepository.getCatById(req.id); 
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
        this.catsRouter.post('/', this.checkObjFormat, this.checkObjKeys, this.checkObjValues, (req, res, next) => {  // all callbacks work! 
            const catWithId = this.catRepository.addCat(req.object); // this. is within a callback function of a method call on the object catsRouter 
            res.status(201).send(catWithId);  
        });

        // PUT route - allows user to add/update information by id
        this.catsRouter.put('/:id', this.isIdValid, this.checkObjFormat, this.checkObjKeys, this.checkObjValues, (req, res, next) => {
            const isUpdated = this.catRepository.updateCatById(req.id, req.object);             // [ {}, {}, {} ]
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
        this.catsRouter.delete('/:id', this.isIdValid, (req, res, next) => {
            const isDeleted = this.catRepository.deleteCatById(req.id); 
            if (isDeleted) {
                res.status(204).send();
            } else {
                const newError =  new Error(`cat id '${req.id}' not found in database`)
                newError.status = 404;
                return next(newError)
            }
        });
    }
}

module.exports.router = CatsRouterClass; 
// export a class by attaching it as a property of the module.exports object 