// CAT API

const express = require('express');         // imports express lib module
const app = express();                     // express() instantiates app 

const morgan = require('morgan');         // helper node modules
const bodyParser = require('body-parser');

app.use(express.json());        
app.use(bodyParser.json())      // automatically attaches parsed JSON object to req.body - should send data as raw in Postman

const catsRouter = require('./catsRouter.js');
const breedsRouter = require('./breedsRouter.js');

app.use('/cats', catsRouter);
app.use('/breeds', breedsRouter);

const PORT = 4001;

app.use(morgan('tiny'));

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
module.exports = app




// EXTRAS:
// separate cats by breed or location, try a nested router? 
// error handlers - not currently required 
// do we need to use body-parser? NO - when do we need to use this? 
// checks that can also be controlled in the UI:
// breedId is a number 
// coat is specific type

// How do we verify that request data in PUT/POST requests is a JSON object?
// The bodyparser recognises JSON and parse it into an object attached to req.body 
// If request data is wrongly formatted, req.body remains empty. This is picked up by 'checkObjKeys' middleware function and generates an error. 
// Otherwise we can check the constructor attribute:
// https://stackoverflow.com/questions/11182924/how-to-check-if-javascript-object-is-json