
require('module-alias/register')
const fetch = require('node-fetch');

const { Given, When, Then, setDefaultTimeout } = require("@cucumber/cucumber");
const assert = require("assert");

// setDefaultTimeout(60 * 1000);

// TODO: set a Before hook between each Scenario hook which resets values of existingRecords, newRecords & jsonResponse as undefined. 

let jsonResponse; 
let existingRecords;
let newRecords; 

Given('I run the node application', function () {
    const app = require('@src/app.js'); 
});

Given('I count the number of records in the database', async function () {
    // makes GET request and counts number of objects returned 
    const endpoint = 'http://localhost:4001/cats/';
    try {
        const response = await fetch(endpoint)
            if (response.ok) {
                jsonResponse = await response.json();
                // json() method takes a Response stream body test and parses it to JSON(resolved result), returns a Promise 
                if (existingRecords === undefined) {
                    existingRecords = jsonResponse.cats.length;
                    console.log("existingRecords: " + existingRecords);
                    // do we need to return existingRecords?
                } else {
                    newRecords = jsonResponse.cats.length; 
                    console.log("newRecords: " + newRecords);
                    // do we need to return newRecords?
                }
            } else {
                throw new Error('GET request failed');
            }
    } catch (error) {
        console.log(error);
    }

})

When('I make a GET request with {word}', async function (path) {
    const endpoint = 'http://localhost:4001/cats' + "/" + path;
    try {
        const response = await fetch(endpoint)
            if (response.ok) {
                jsonResponse = await response.json();
                // json() method takes a Response stream body test and parses it to JSON(resolved result), returns a Promise 
            } else {
                throw new Error('GET request failed');
            }
    } catch (error) {
        console.log(error);
    }
});

When('I make a POST request with a cat object', async function () {
    const data = {
        name: 'Delilah',
        description: 'Siamese' 
    };
    const endpoint = 'http://localhost:4001/cats/';
    try {
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
            throw new Error('POST Request failed');
        } 
    } catch (error) {
        console.log(error);
        // FIXME: when there is an error why doesn't this stop the execution of steps? 
    }
})
// note that async await...is coupled with a try...catch block (no need for .then chain)
// a fetch request chained with .then statements and success and failure handlers does not need a try...catch block 

Then('I get cat information with correct {string}', function (name) {
    let returnedName = jsonResponse.name;
    assert.strictEqual(returnedName, name);
})

Then('the cat object is returned with an id attached', function () {
    let newId = jsonResponse.id; 
    console.log("newId:" + newId);
    assert.ok(newId);
})

Then('the number of records in the database has increased', function () {
    assert.ok(existingRecords);
    assert.ok(newRecords);
    assert.strictEqual(existingRecords+1, newRecords);
})