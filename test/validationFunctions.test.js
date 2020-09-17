
const request =  require('supertest');
const validate = require('../src/validationFunctions');

const isInvalidString = validate.isInvalidString; 
const isInvalidNum = validate.isInvalidNum; 
const generateErr400 = validate.generateErr400; 
const generateErr404 = validate.generateErr404; 
const checkObjFormat = validate.checkObjFormat; 
const checkObjKeys = validate.checkObjKeys; 
const checkObjValues = validate.checkObjValues; 
 

describe( "checks for invalid data type", () => {
    
    let [ notNumber, number ]= [ "foo", 10 ];
    let [ notString, string ] = [ 10 , "foo" ];

    test('returns true for an invalid string', () => { 
        expect(isInvalidString(notString)).toBe(true); 
        expect(isInvalidString(string)).toBe(false); 
    });

    test('returns true for an invalid number', () => {
        expect(isInvalidNum(notNumber)).toBeTruthy;
        expect(isInvalidNum(number)).toBeFalsey;
    });
});

describe( "error generator functions should return errors", () => {

    test('returns Error object with 400 status and given message', () => {
        expect(generateErr400('BAD REQUEST')).toHaveProperty("message", "BAD REQUEST");    
        expect(generateErr400('BAD REQUEST')).toHaveProperty("status", 400);
    });

    test('returns Error object with 404 status and given message', () => {
        expect(generateErr404(10)).toHaveProperty("message", "id '10' not found in database");    
        expect(generateErr404(10)).toHaveProperty("status", 404);
    });
});


describe("checks for valid property keys and values", () => { 

    let emptyArr = [];
    let invalidKey = ["name", "ageInMonths", "description"];
    let validKeys = ["name", "description"]; 

    let invalidObj = {name: "cat", description: 5}
    let validObj= {name: "cat", description: "floofy"} 

    it('returns an errorMessage for an empty array of keys', () => {
        expect(typeof checkObjFormat(emptyArr)).toBe("string");
        expect(checkObjFormat(emptyArr)).toEqual('Error: Request data is not a valid object. ');
        expect(checkObjFormat(validKeys)).toEqual('Check successful - request data verified as valid object');
    });

    it('returns an errorMessage for invalid keys', () => {
        expect(checkObjKeys(invalidKey)).toMatch(/(error)/i);  // matches substring
        expect(checkObjKeys(validKeys)).toMatch(/(success)/i);
    });

    it('returns an errorMessage for invalid values', () => {
        expect(checkObjValues(validKeys,invalidObj)).toMatch(/(error)/i);  // matches substring
        expect(checkObjValues(validKeys, validObj)).toMatch(/(success)/i);
    });

});
