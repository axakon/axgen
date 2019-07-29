/* eslint-disable no-unused-expressions */
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const commandManager = require('./CommandManager');

const { expect } = chai;
chai.use(chaiAsPromised);

class DummyCommand {
}

describe('Axgen', () => {
  describe('#initiate', () => {
    it('only contains valid plugins', () => {
      // commandManager.initiate({});
      // expect(commandManager.commands).to.be.length.greaterThan(0);
      // commandManager.commands.forEach((command) => {
      //   expect(command.beforeRun).to.not.be.undefined;
      //   expect(command.run).to.not.be.undefined;
      //   expect(command.afterRun).to.not.be.undefined;
      // });
    });
  });

  describe('#addCommand', () => {
    it('can add commands', () => {
      commandManager.addCommand('mycommand', DummyCommand);
      expect(commandManager.hasCommand('mycommand')).to.be.true;
    });
  });

  describe('#getCommand', () => {
    it('can get commands', () => {
      commandManager.addCommand('mycommand', DummyCommand);
      const command = commandManager.getCommand('mycommand');
      expect(command).to.not.be.undefined;
    });
  });
});
