// const Path = require('path');
// const fs = require('fs');
// const Parser = require('../../core/parser/Parser');
const repositoryManager = require('../../core/repository/RepositoryManager');

const name = 'generate';

class Generate {
  constructor(cli) {
    this.cli = cli;
  }

  async run(commands) {
    if (!commands || commands.length === 0) {
      this.printHelp();
      return;
    }
    const command = commands[0];
    // const template;
    //  If the command is a path, we search for the template file first
    // const path = Path.resolve(commands[0]);
    // const basePath = Path.dirname(path);
    // const file = fs.readFileSync(path, {
    //   encoding: 'UTF-8',
    // });
    // const parser = new Parser(this.cli);
    // const templateJson = JSON.parse(file);
    // template = parser.parse(templateJson, basePath);
    //  (optional) If this is an URL we attempt to create a template via the URL

    //  If not, we go to the repository manager and ask if it contains the file

    const template = repositoryManager.getTemplate(command);

    if (template) {
      await template.execute(process.cwd());
      this.cli.logInformation('\x1b[32m%s\x1b[0m - %s', 'SUCCESS!', `${template.name} successfully generated`);
    } else {
      this.cli.logInformation(`No template named "${command}" exists`);
    }
  }

  printHelp() {
    this.cli.logInformation('You need to specity a file path!');
    this.cli.logInformation('For example \'axgen generate my-template.json\'');
  }
}

module.exports = {
  name,
  command: Generate,
};
