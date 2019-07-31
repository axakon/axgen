const utils = require('../../utils/utils');
const subCommands = require('./commands');

class Generator {
  constructor(cli) {
    this.cli = cli;
  }

  async run(commands, parameters, flags) {
    if (subCommands[commands[0]]) {
      await new subCommands[commands[0]](this.cli)
        .run(
          utils.getSubCommands(commands),
          parameters,
          flags,
        );
    } else {
      // eslint-disable-next-line new-cap
      await new subCommands.default(this.cli)
        .run(
          commands,
          parameters,
          flags,
        );
    }
  }

  printHelp(command) {
    this.cli.logInformation(`No available command exists for ${command}, available commands are:`);
    subCommands.forEach((c) => {
      this.cli.logInformation(c);
    });
  }
}

module.exports = utils.createPlugin('generate', Generator);
