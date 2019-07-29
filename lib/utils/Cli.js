const minimist = require('minimist');
const readline = require('readline');

class Cli {
  constructor(stdio) {
    this.console = stdio || console;
    this.verbose = false;
  }

  processInput() {
    const inputArray = process.argv.slice(2);
    const args = minimist(inputArray);

    const parseFlags = (opts) => {
      const options = [];
      for (const entry of Object.entries(opts).slice(1)) {
        const value = entry[1];
        if (value === true) {
          options[entry[0]] = true;
        }
      }
      return options;
    };

    const parseParameters = (params) => {
      const parameters = [];
      for (const entry of Object.entries(params).slice(1)) {
        const value = entry[1];
        if (value !== true) {
          parameters[entry[0]] = value.trim ? value.trim() : value;
        }
      }
      return parameters;
    };

    const flags = parseFlags(args);
    const parameters = parseParameters(args);
    this.verbose = flags.v;
    const input = {
      commands: args._,
      flags,
      parameter: parameters,
    };

    this.logVerbose('Parsed input:', input);
    return input;
  }

  logInformation(msg, ...args) {
    this.console.log(msg, ...args);
  }

  logVerbose(msg, ...args) {
    if (this.verbose) {
      this.console.log(msg, ...args);
    }
  }

  logError(msg, ...args) {
    this.console.error(msg, ...args);
  }

  // this needs to be as adaptable as the console switching in the constructor
  // eslint-disable-next-line class-methods-use-this
  async waitForInput(msg) {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    return new Promise((resolve) => {
      rl.question(`${msg}: `, (answer) => {
        resolve(answer);
        rl.close();
      });
    });
  }
}

module.exports = Cli;
