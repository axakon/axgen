const InvalidCommandError = require('./errors/InvalidCommandError');
const commandManager = require('./utils/CommandManager');
const repositoryManager = require('./plugins/core/repository/RepositoryManager');
const utils = require('./utils/utils');

function getMainCommand(commands) {
  return commands[0];
}

class Axgen {
  constructor(cli) {
    this.cli = cli;
  }

  run(commands, parameters, flags) {
    return new Promise(async (resolve, reject) => {
      try {
        commandManager.initiate(this.cli);
        repositoryManager.initiate(this.cli);
        if (!commands || commands.length === 0) {
          this.printHelp();
          resolve();
          return;
        }

        const mainCommand = getMainCommand(commands);
        if (!commandManager.hasCommand(mainCommand)) {
          throw new InvalidCommandError(`No command exists for "${mainCommand}"`);
        }
        const command = commandManager.getCommand(mainCommand);

        if (command.beforeRun) {
          command.beforeRun();
        }


        await command.run(
          utils.getSubCommands(commands),
          parameters,
          flags,
        );

        if (command.afterRun) {
          command.afterRun();
        }

        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }

  printHelp() {
    this.cli.logInformation('This is supposed to be our help instructions!');
  }
}

module.exports = Axgen;
