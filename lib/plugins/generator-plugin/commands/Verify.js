const Path = require('path');
const fs = require('fs');
const Parser = require('../../core/parser/Parser');

const name = 'verify';

class VerifyCommand {
  constructor(cli) {
    this.cli = cli;
  }

  async run(commands) {
    if (!commands || commands.length === 0) {
      this.printHelp();
      return;
    }
    const path = Path.resolve(commands[0]);
    const basePath = Path.dirname(path);
    const file = fs.readFileSync(path, {
      encoding: 'UTF-8',
    });
    const parser = new Parser(this.cli);
    const templateJson = JSON.parse(file);
    parser.parse(templateJson, basePath);

    this.cli.logVerbose(templateJson);
    this.cli.logInformation('\x1b[32m%s\x1b[0m - %s', 'OK!', `${path} successfully verified`);
  }

  printHelp() {
    this.cli.logInformation('You need to specity a file path!');
    this.cli.logInformation('For example \'axgen generate verify my-template.json\'');
  }
}

module.exports = {
  name,
  command: VerifyCommand,
};
