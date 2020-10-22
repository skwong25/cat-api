
class CatsRouter {
    constructor(catRepository) {
        this.express = require('express');  
        this.shortid = require('shortid');
        this.validate = require('./validationFunctions');       
        this.catsRouter = this.express.Router();                // creates instance of Express router
        this.catRepository = catRepository;

        this.isIdValid = this.isIdValid.bind(this);     
        this.checkObject = this.checkObject.bind(this); 
    }
    // Note that methods that are CALLED in neighbouring methods require binding to the class 

    // checks if id is a valid shortid                          
    isIdValid(req, res, next) {  

        let id = req.params.id; 
        console.log(`id '${id}'' being verified`);
        
        if (this.shortid.isValid(id)) {   
            req.id = id;                                             
            console.log('id verified as valid shortid');
            next() 
        } else {
            const err = this.validate.generateErr400(`'${id}' is not a valid shortid`);
            return next(err);
        };
    }

    // consolidates Object checks: Each check function returns Error or Success message - those prepended with "Error.." are passed onto generate error. 

    checkObject(req, res, next) { 

        const object = req.body;  // JSON bodyparses attaches parsed object to req.body so no need to check: typeof object === "object" 
        const keys = Object.keys(object);
        const validKeys = ["name", "ageInYears", "favouriteToy", "description"];
        let arrayOfFunctions = [this.validate.checkObjFormat, this.validate.checkObjKeys, this.validate.checkObjValues];

        arrayOfFunctions.forEach((funct) => { 
            let message = funct(keys, object, validKeys);

            if (message[0] === "E") {
                const err = this.validate.generateErr400(message);
                return next(err);
            } else {
                console.log(message);
            };
        });
        req.object = object;  // reassignment of req.body to req.object is another check that its successfully passed this check 
        next()
    }
    
    initializeRoutes() {

        // GET route all 
        this.catsRouter.get('/', async (req, res, next) => {  
            try {
                let cats = await this.catRepository.getAllCats(); // await returns the resolved value of the Promise
                console.log(`router: got em!`);  
                res.json({"cats": cats});
                // res.json sends a json response
            } catch (err) {
                next(err);
            } 
            // errors thrown within the async function need to be caught with a try...catch statement  
        });

        // GET route by id 
        this.catsRouter.get('/:id', this.isIdValid, async (req, res, next) => { 
            try { 
                // getCatById returns cat object or null 
                const foundCat = await this.catRepository.getCatById(req.id);         
                if (foundCat) { 
                    console.log('router: cat retrieved ' + foundCat);
                    res.send(foundCat);
                } else {
                    return next(this.validate.generateErr404(req.id))
                }
            } catch (err) {
                next(err)
            }
        });

        // POST route 
        this.catsRouter.post('/', this.checkObject, async (req, res, next) => {   
            try {
                const catWithId = await this.catRepository.addCat(req.object); 
                res.status(201).send(catWithId);  
            } catch (err) {
                next(err); 
            }
        });

        // PUT route - allows user to add/update information by id
        this.catsRouter.put('/:id', this.isIdValid, this.checkObject, async (req, res, next) => {
            // updateCatById returns updated cat object or null 
            try {
                const isUpdated = await this.catRepository.updateCatById(req.id, req.object);            
                if (isUpdated) {
                    console.log(`cat id '${req.id}' successfully updated`)
                    res.send(isUpdated); 
                } else {
                    return next(this.validate.generateErr404(req.id))
                }
            } catch (err) {
                next(err);
            }
        });

        // DEL route
        this.catsRouter.delete('/:id', this.isIdValid, async (req, res, next) => {
            // deleteCatById returns true (deleted) or null 
            try {
                const isDeleted = await this.catRepository.deleteCatById(req.id); 
                if (isDeleted) {
                    res.status(204).send(); // 204 NO CONTENT 
                } else {
                    return next(this.validate.generateErr404(req.id))
                }
            } catch (err) {
                next(err); 
            }
        });
    }
} 

module.exports.router = CatsRouter; 
// export a class by attaching it as a property of the module.exports object 