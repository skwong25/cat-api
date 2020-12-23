
require('module-alias/register')
const fetch = require('node-fetch');

const { Given, When, Then, Before, setDefaultTimeout } = require("@cucumber/cucumber");
const assert = require("assert");
const { Console } = require('console');

// setDefaultTimeout(60 * 1000);

// Before hook executes before each Scenario hook & resets values of variables as undefined. 
Before(function () {
    jsonResponse = undefined; 
    existingRecords = undefined;
    newNumberOfRecords = undefined; 
    lastId = undefined;
    responseG = undefined; 
})

let jsonResponse; 
let existingRecords;
let newNumberOfRecords; 
let lastId;
let responseG; 

Given('I run the node application', function () {
    const app = require('@src/app.js'); 
});

Given('I count the number of records in the database', async function () {
    // makes GET request and counts number of objects returned 
    const endpoint = 'http://localhost:4001/cats/';
    const response = await fetch(endpoint)
    if (response.ok) {
        jsonResponse = await response.json();
        // json() method takes a Response stream body test and parses it to JSON(resolved result), returns a Promise 
        if (existingRecords === undefined) {
            existingRecords = jsonResponse.cats.length;
        } else {
            newNumberOfRecords = jsonResponse.cats.length; 
        }
    } else {
        throw new Error('GET request failed');
    }
})

When('I make a GET request with {word}', async function (path) {
    const endpoint = 'http://localhost:4001/cats/' + path;
    const response = await fetch(endpoint)
    if (response.ok) {
        jsonResponse = await response.json();
        // json() method takes a Response stream body test and parses it to JSON(resolved result), returns a Promise 
    } else {
        throw new Error('Test: GET request failed');
    }
});

When('I make a GET request for the same record', async function () {
    const endpoint = 'http://localhost:4001/cats/' + lastId;
    responseG = await fetch(endpoint)
    if (responseG) {
        return responseG; 
    } else {
        throw new Error('Test: GET request failed');
    }
});

When('I make a POST request', async function () {
    const data = {
        name: 'Delilah',
        description: 'Siamese' 
    };
    const endpoint = 'http://localhost:4001/cats/';
    const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            // 'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': 56
            },
        body: JSON.stringify(data)
    });
    if (response.ok) {
        jsonResponse = await response.json(); 
        return jsonResponse; 
    } else {
        throw new Error('Test: POST Request failed');
    } 
})

When('I make a DEL request', async function () {
    // GET request to access id of the last record 
    let endpoint = 'http://localhost:4001/cats/'; 
    let response = await fetch(endpoint)
    if (response.ok) {
        jsonResponse = await response.json(); 
        console.log("Within DEL request, no. of records" + jsonResponse.cats.length);
        lastId = jsonResponse.cats.pop().id;
        // arr.pop() returns last element, note it mutates jsonResponse 
    } else {
        throw new Error('Test: GET request failed');
    }
    // DEL request 
    endpoint = 'http://localhost:4001/cats/' + lastId;  
    response = await fetch(endpoint, {
            method: 'DELETE'
        });
    if (!response.ok) {
        throw new Error('Test: DEL Request failed');
    } 
})

Then('I get cat information with correct {string}', function (name) {
    let returnedName = jsonResponse.name;
    assert.strictEqual(returnedName, name);
})

Then('the cat object is returned with an id attached', function () {
    let newId = jsonResponse.id; 
    assert.ok(newId);
})

Then('the number of records in the database increases by {int}', function (number) {
    assert.ok(existingRecords);
    assert.ok(newNumberOfRecords);
    assert.strictEqual(existingRecords + number, newNumberOfRecords);
})

Then('the number of records in the database decreases by {int}', function (number) {
    assert.ok(existingRecords);
    assert.ok(newNumberOfRecords);
    assert.strictEqual(existingRecords - number, newNumberOfRecords);
})

Then('it returns a response with HTTP status code of {int}', function (code) {
    assert.strictEqual(responseG.status, code); 
})

