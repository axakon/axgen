const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');
const Axgen = require('./Axgen');
const InvalidCommandError = require('./errors/InvalidCommandError');

const { expect } = chai;
chai.use(chaiAsPromised);

describe('Axgen', () => {
  let axgen;
  let fakeCli;

  beforeEach(() => {
    fakeCli = {
      logInformation: sinon.fake(),
    };
    axgen = new Axgen(fakeCli);
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('#constructor', () => {
    it('should store the cli', () => {
      expect(axgen.cli).to.not.equal(undefined);
    });
  });

  describe('#run', () => {
    it('should return a promise', () => {
      const fn = axgen.run();
      return expect(fn).to.be.a('promise');
    });

    it('should print help if empty command', async () => {
      await axgen.run();
      expect(fakeCli.logInformation).to.have.callCount(1);
    });

    it('should throw error if invalid command', () => {
      const fn = axgen.run(['asdsa']);
      return expect(fn).to.be.rejectedWith(InvalidCommandError);
    });
  });
});
