// Builds Server with the non-test Id Generator

const shortid = require('shortid');
const buildServer = require('./app');

const generateId = shortid.generate;

module.exports = buildServer(generateId);