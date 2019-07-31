const verify = require('./Verify');
const generate = require('./Generate');

module.exports[verify.name] = verify.command;
module.exports.default = generate.command;
