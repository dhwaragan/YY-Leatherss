const serverless = require('serverless-http');
const app = require('../../dist/server.cjs').default;

module.exports.handler = serverless(app);