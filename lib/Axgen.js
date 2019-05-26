const InvalidCommandError = require('./errors/InvalidCommandError');

function getMainCommand(commands) {
  return commands[0];
}

class Axgen {
  constructor(cli) {
    this.cli = cli;
  }

  run(commands) {
    return new Promise((resolve) => {
      if (!commands || commands.length === 0) {
        this.printHelp();
        resolve();
        return;
      }

      this.commands = [];
      const mainCommand = getMainCommand(commands);
      if (!this.commands[mainCommand]) {
        throw new InvalidCommandError(`No command exists for "${mainCommand}"`);
      }

      resolve();
    });
  }

  printHelp() {
    this.cli.logInformation('HALP');
  }
}

module.exports = Axgen;
