// note that breedRepo class object also should be instantiated here and passed dao, for consistency. 

// CAT API

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

    // class instantiation of imported repositories and routers

    // note breedsRouter = express.Router() - router instance created in breedsRouter.js 
    const breedsRouter = require('./breedsRouter');
    
    // note ./catsRepo module.exports = {repository: CatRepository}
    const importObject = require('./catsRepo'); 
    const CatRepository = importObject.repository; 
    const catRepository = new CatRepository(dao); 
    
    const importRouterObject = require('./catsRouter');      
    const CatsRouter = importRouterObject.router;
    const catsRouter = new CatsRouter(catRepository); 

    catsRouter.initializeRoutes(); // calls routing method/handlers 

    // Note .catsRouter is a method on the class instance which creates an instance of router 
    app.use('/cats', catsRouter.catsRouter);  
    app.use('/breeds', breedsRouter);

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
// The bodyparser recognises JSON and parse it into an object attached to req.body 
// If request data is wrongly formatted, req.body remains empty. This is picked up by 'checkObjKeys' middleware function and generates an error. 
// Otherwise we can check the constructor attribute:
// https://stackoverflow.com/questions/11182924/how-to-check-if-javascript-object-is-json
