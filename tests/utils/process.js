const path = require('path');

module.exports = function setArgv(...args) {
  process.argv = [
    // argv always include the executing binary path and the program path
    'default 1',
    'default 2',
    ...args,
  ];
};


module.exports.axgenExec = path.join(__dirname, '..', '..', 'cli', 'axgen');
