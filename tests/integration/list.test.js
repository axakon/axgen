const { expect } = require('chai');
const { execSync } = require('child_process');
const { axgenExec } = require('../utils/process');


describe('List command integration', () => {
  beforeEach(() => {
    // We need to setup the template folder
  });

  describe('list', () => {
    it('should list all available templates', () => {
      const exec = execSync(`${axgenExec} list`);
      const result = Buffer.from(exec, 'base64').toString();
      expect(result).to.contain('From test-template');
      expect(result).to.contain('My first template, C#, project');
    });
  });
});
