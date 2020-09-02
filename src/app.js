// CAT API

const express = require('express');         // imports express lib module
const app = express();                     // express() instantiates app 
const morgan = require('morgan');
const bodyParser = require('body-parser')

app.use(express.json());        // app.use(bodyParser.urlencoded({extended: true})); // if we have this, we should send data as urlencoded in Postman 
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
// in PUT requests, if a value is the same, it doesn't need to get updated again
