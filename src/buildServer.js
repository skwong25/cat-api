// Builds Server with the non-test Id Generator

// non-test Id Generator
const shortid = require('shortid');
const generateId = shortid.generate;

// builds server
const buildServer = require('./app');
module.exports = buildServer(generateId); 