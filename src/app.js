// CAT API

const buildServer = (idGenerator) => {

    // imports express lib module
    // express() instantiates app 
    const express = require('express');        
    const app = express();      
    
    // helper node modules
    const morgan = require('morgan');                         

    app.use(morgan('tiny'));
    app.use(express.json());        
    // Note that expresses' in-built bodyParser attaches parsed JSON object to req.body                              

    // imports & class instantiation of repositories and routers
    // note module.exports = {repository: CatRepository}
    const breedsRouter = require('./breedsRouter');

    const importObject = require('./catsRepo'); 
    const CatRepository = importObject.repository; 
    const catRepository = new CatRepository(idGenerator.generate); 

    const importRouterObject = require('./catsRouter');      
    const CatsRouter = importRouterObject.router;
    const catsRouter = new CatsRouter(catRepository); 

 

    catsRouter.initializeRoutes(); // calls the routes 

    app.use('/cats', catsRouter.catsRouter);  
    app.use('/breeds', breedsRouter);

    const PORT = 4001;

    // error-handling sends back error responses 
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

module.exports = buildServer;   

// we don't want it to export value of the function call because this does not allow us to swap generateId out for a mock.
//  Maybe another file imports buildServer and calls buildServer(generateId); 


// How do we verify that request data in PUT/POST requests is a JSON object?
// The bodyparser recognises JSON and parse it into an object attached to req.body 
// If request data is wrongly formatted, req.body remains empty. This is picked up by 'checkObjKeys' middleware function and generates an error. 
// Otherwise we can check the constructor attribute:
// https://stackoverflow.com/questions/11182924/how-to-check-if-javascript-object-is-json
