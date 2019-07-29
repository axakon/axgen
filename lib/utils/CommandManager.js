const commands = require('../plugins');

class CommandManager {
  constructor() {
    this.commands = [];
  }

  initiate(cli) {
    this.cli = cli;
    commands.forEach((command) => {
      this.addCommand(command.name, command.plugin);
    });
  }

  addCommand(name, command) {
    this.commands[name] = command;
  }

  hasCommand(name) {
    return !!this.commands[name];
  }

  getCommand(name) {
    return new this.commands[name](this.cli);
  }
}

module.exports = new CommandManager();
