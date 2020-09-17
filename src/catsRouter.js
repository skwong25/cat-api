
class CatsRouter {
    constructor(catRepository) {
        this.express = require('express');  
        this.shortid = require('shortid');
        this.validate = require('./validationFunctions');       
        this.catsRouter = this.express.Router();                // creates instance of Express router
        this.catRepository = catRepository;

        this.isIdValid = this.isIdValid.bind(this);     
        // this.checkObjValues = this.checkObjValues.bind(this);  
        this.checkObject = this.checkObject.bind(this); 
    }
    // Note that methods that contain neighbouring method calls require binding to the class

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
            return next(this.validate.generateErr400(`'${id}' is not a valid shortid`));
        };
    }

    // consolidates Object checks 
    // Each check function returns a message - messages prepended with "Error.." are passed onto generate error. 
    checkObject(req, res, next) { 

        const object = req.body;  // JSON bodyparses attaches parsed object to req.body so no need to check: typeof object === "object" 
        const keys = Object.keys(object);
        const validKeys = ["name", "ageInYears", "favouriteToy", "description", "breedId"];
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

    req.object = object;         
    next()
    }
    
    initializeRoutes() {

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
                return next(this.validate.generateErr404(req.id))
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
                return next(this.validate.generateErr404(req.id))
            }
        });

        // DEL route
        this.catsRouter.delete('/:id', this.isIdValid, (req, res, next) => {
            // updateCatById returns updated cat object or null 
            const isDeleted = this.catRepository.deleteCatById(req.id); 
            if (isDeleted) {
                res.status(204).send(); // 204 NO CONTENT 
            } else {
                return next(this.validate.generateErr404(req.id))
            }
        });
    }
} 

module.exports.router = CatsRouter; 
// export a class by attaching it as a property of the module.exports object 