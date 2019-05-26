const minimist = require('minimist');

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
          parameters[entry[0]] = value.trim();
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

    // todo: This encounters problems when parsing the flags
    // They doesnt seem to stringify correctly
    this.logVerbose(`Parsed input: ${JSON.stringify(input)}`);

    return input;
  }

  logInformation(msg) {
    this.console.log(msg);
  }

  logVerbose(msg) {
    if (this.verbose) {
      this.console.log(msg);
    }
  }

  logError(msg) {
    this.console.error(msg);
  }
}

module.exports = Cli;
