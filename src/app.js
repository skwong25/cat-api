// CAT API
// DAO, Router and Repository classes are instantiated here. DAO starts up the database connection. 
// Route handlers are called and Routers are mounted. Express server is set up listening.

const buildServer = () => {

    const path = require('path')
    const dbPath = path.resolve(__dirname, '../sqlite/tables.db')

    // instantiates dao class to be passed as param into Repo classes 
    // upon instantiation, this starts up a SQLite database connection
    const AppDAO = require('./dao'); 
    const dao = new AppDAO(dbPath); 

    // imports express lib module
    // express() instantiates app 
    const express = require('express');        
    const app = express();      
    
    // helper node modules
    const morgan = require('morgan');                         

    app.use(morgan('tiny'));
    app.use(express.json());        
    // Note Expresses' in-built bodyParser attaches parsed JSON object to req.body                              

    // class instantiation of imported repositories and router classes
    let importObject = require('./breedsRepo'); 
    const BreedRepository = importObject.repository; 
    const breedRepository = new BreedRepository(dao); 

    let importRouterObject = require('./breedsRouter');      
    const BreedsRouter = importRouterObject.router;
    const breedsRouter = new BreedsRouter(breedRepository); 
    
    // note ./catsRepo module.exports = {repository: CatRepository}
    importObject = require('./catsRepo'); 
    const CatRepository = importObject.repository; 
    const catRepository = new CatRepository(dao); 
    
    importRouterObject = require('./catsRouter');      
    const CatsRouter = importRouterObject.router;
    const catsRouter = new CatsRouter(catRepository); 

    // calls routing method/handlers 
    breedsRouter.initializeRoutes(); 
    catsRouter.initializeRoutes();

    // Note .Router is a method on the class instance that creates instance of Express router
    app.use('/cats', catsRouter.catsRouter);  
    app.use('/breeds', breedsRouter.breedsRouter);

    const PORT = 4001;

    // error-handling middleware sends back error responses 
    app.use((err, req, res, next) => {
        let status = err.status || 500  
        let message = err.message || 'test message'
        res.status(status).send(message); 
    });

    // sets server up (listening for reqs)
    app.listen(PORT, () => { 
        console.log(`the server is listening for catcalls on port ${PORT}`)
    });

    return app; 
}

module.exports = buildServer();   

// How do we verify that request data in PUT/POST requests is a JSON object?
// The bodyparser recognises JSON and parses it into an object attached to req.body 
// If request data is wrongly formatted, req.body remains empty. This is picked up by 'checkObjKeys' middleware function and generates an error. 
// Otherwise we can check the constructor attribute:
// https://stackoverflow.com/questions/11182924/how-to-check-if-javascript-object-is-json
