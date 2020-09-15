
// SIMPLE JS FUNCTIONS: 
function isInvalidString(value) {
    return typeof value !== "string"                                  
}
    
function isInvalidNum(value) {  
        return typeof(value) !== "number";  
}
    
// 400 - BAD REQUEST
function generateErr400(message) { 
    const newError = new Error(message);
    newError.status = 400; 
    return newError; 
} 

// 404 - NOT FOUND
function generateErr404(id) {
    let message = `id '${id}' not found in database`
    const newError = new Error(message);
    newError.status = 404; 
    return newError; 
}

// OBJECT CHECKS: to follow pattern -> return error OR success message string. Error message to be prepended with 'Error'.  

// checks for a populated object 
function checkObjFormat(keys) {
    let message = (keys.length !== 0) ? 
        'Check successful - request data verified as valid object' : 'Error: Request data is not a valid object. ' 
    return message; 
} 

// checks for valid keys 
function checkObjKeys(keys) {
    const validKeys = ["name", "ageInYears", "favouriteToy", "description", "breedId"];
    let invalidKeys = keys.filter((key) => {  // returns condition 
        return !validKeys.includes(key);
    });
    let message = (invalidKeys.length === 0) ? 'Check successful - object keys valid' : `Error: Property '${invalidKeys[0]}' is invalid` ;
    return message;  
}

    
// checks for valid breed object keys 
function checkBreedObjKeys(keys)  { // [ "name", description" ]
    const validKeys = ["name", "description"]; 
    let invalidKeys = keys.filter((key) => {
        return !validKeys.includes(key);
    });
    let message = (invalidKeys.length === 0) ? 'Check successful - object keys valid' : `Error: Property '${invalidKeys[0]}' is invalid` ;
    return message;
}


// checks for valid property values  
function checkObjValues(keys, object) {  
    let isError = [];
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
    checkBreedObjKeys,
    checkObjValues,
}   

// This outputs: { function1: [Function: getUser], function2: [Function: getUsers] }
// This common pattern for JS developers is called the revealing module pattern - giving us function names and documents API clearly at end of the file. 
// https://stackify.com/node-js-module-exports/