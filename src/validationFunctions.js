// SIMPLE JS FUNCTIONS:

// isInvalidString() checks the data type of a passed argument. Returns a truthy in the event of a non-string. Else, returns falsey. 
function isInvalidString(value) {
    return typeof value !== "string"                                  
}

// isInvalidNum() checks the data type of a passed argument. Returns a truthy in the event of a non-number. Else, returns falsey. 
function isInvalidNum(value) {  
    return typeof(value) !== "number";  
}

// 400 - BAD REQUEST
// generateErr400() receives a string argument of a descriptive error message. Returns an 400 BAD REQUEST error.
function generateErr400(message) { 
    const newError = new Error(message);
    newError.status = 400; 
    return newError; 
} 

// 404 - NOT FOUND
// generateErr404() receives a string of an id which has not been found in the database. Returns an 400 NOT FOUND error.
function generateErr404(id) {
    let message = `id '${id}' not found in database`
    const newError = new Error(message);
    newError.status = 404; 
    return newError; 
}

// OBJECT CHECKS: to follow pattern -> return error OR success message string. Error message to be prepended with 'Error'.  

// checks for a populated object 
function checkObjFormat(keys) { 
    console.log("ARE WE EVEN GETTING THIS FAR?"); // TODO: Delete post-debug 
    let message = (keys.length !== 0) ? 
        'Check successful - request data verified as valid object' : 'Error: Request data is not a valid object. ' 
    console.log("MESSAGE: " +  message); // TODO: Delete post-debug 
    return message; 
} 

// checks for valid keys 
function checkObjKeys(keys, object, validKeys) {
    // the second argument to remain 'object' - refer to checkObject function in catsRouter.js 
    console.log("CHECK validKeys: " +  JSON.stringify(validKeys));
    console.log("CHECK keys: " +  keys)
    // FIXME: an empty array will pass this check - false positive
    let invalidKeys = keys.filter((key) => {  
        console.log("CHECK key: " +  key)
        return !validKeys.includes(key);
    });
    let message = (invalidKeys.length === 0) ? 'Check successful - object keys valid' : `Error: Property '${invalidKeys[0]}' is invalid` ;
    return message;  
}

// checks for valid property values  
function checkObjValues(keys, object) {  
    let isError = [];
    // FIXME: an empty array will pass this check - false positive
    keys.forEach((key) => {
        let value = object[key]; 
        let invalidParam = (key === "ageInYears") ? isInvalidNum(value) : isInvalidString(value);
        if (invalidParam === true) {  
            isError.push(`Error: Invalid ${key} parameter: "${value}"`)
        }  
    })      
    let message = isError[0] || 'Check successful - object property values valid';
    return message; 
}

module.exports = { 
    isInvalidString, 
    isInvalidNum, 
    generateErr400, 
    generateErr404,
    checkObjFormat,
    checkObjKeys,
    checkObjValues,
}   

// This export object outputs: { getUser: [Function: getUser], getUsers: [Function: getUsers] }
// This common pattern for JS developers is called the revealing module pattern - giving us function names and documents API clearly at end of the file. 
// https://stackify.com/node-js-module-exports/