/* eslint-disable no-unused-expressions */
const sinon = require('sinon');
const chai = require('chai');
const sinonChai = require('sinon-chai');
const setArgv = require('../../tests/utils/process');
const Cli = require('./Cli');

const { expect } = chai;
chai.use(sinonChai);


describe('CLI', () => {
  let cli;

  beforeEach(() => {
    cli = new Cli();
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('#constructor', () => {
    it('defaults to console as stdio', () => {
      expect(cli.console).to.eql(console);
      expect(cli.verbose).to.be.false;
    });
  });

  describe('#processInput', () => {
    it('should return a command hierchy', () => {
      setArgv(
        'list',
        'potato',
        '-v',
        '--pie',
        '-x 4',
        '--t=hejsan',
      );
      const commands = cli.processInput();
      expect(commands.commands).to.deep.equal(['list', 'potato']);
      expect(commands.flags.v).to.be.true;
      expect(commands.flags.pie).to.be.true;
      expect(commands.parameter.x).to.equal('4');
      expect(commands.parameter.t).to.equal('hejsan');
    });

    it('should set verbose from -v flag', () => {
      setArgv('-v');
      cli.processInput();
      expect(cli.verbose).to.be.true;
    });
  });

  describe('#logInformation', () => {
    let fake;
    beforeEach(() => {
      fake = sinon.fake();
      cli = new Cli({
        log: fake,
      });
    });

    it('should call log on console object', () => {
      cli.logInformation('test');
      expect(fake).to.have.been.calledWith('test');
    });
  });

  describe('#logVerbose', () => {
    let fake;
    beforeEach(() => {
      fake = sinon.fake();
      cli = new Cli({
        log: fake,
      });
    });

    it('shouldnt log by default', () => {
      cli.logVerbose('test');
      expect(fake).not.to.have.been.calledOn();
    });

    it('should log when verbose is true', () => {
      cli.verbose = true;
      cli.logVerbose('test');
      expect(fake).to.have.been.calledWith('test');
    });
  });

  describe('#logError', () => {
    let fake;
    beforeEach(() => {
      fake = sinon.fake();
      cli = new Cli({
        error: fake,
      });
    });

    it('should call error on console object', () => {
      cli.logError('test');
      expect(fake).to.have.been.calledWith('test');
    });
  });
});
