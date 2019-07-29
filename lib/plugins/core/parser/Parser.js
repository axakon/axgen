const TemplateFormatError = require('../../../errors/TemplateFormatError');
const createCopyInstruction = require('./instructions/Copy').createFromJsonStep;
const createInputInstruction = require('./instructions/Input').createFromJsonStep;
const Template = require('./Template');

function getHeader(templateJson) {
  const metaData = templateJson.meta;

  if (!metaData) {
    throw new TemplateFormatError('Missing meta header');
  }

  if (!metaData.name) {
    throw new TemplateFormatError('Missing name field inside meta header');
  }

  if (!metaData.version) {
    throw new TemplateFormatError('Missing version field inside meta header');
  }

  return {
    name: metaData.name,
    version: metaData.version,
  };
}

function getInstructions(templateJson, templateBasePath) {
  const { steps } = templateJson;
  if (!steps) {
    throw new TemplateFormatError('Missing steps field');
  }
  const keys = Object.keys(steps);
  if (keys.length === 0) {
    throw new TemplateFormatError('Requires at least 1 step instruction');
  }

  const instructions = [];
  keys.forEach((key) => {
    const step = steps[key];
    switch (step.type) {
      case 'copy':
        instructions.push(createCopyInstruction(step, key, templateBasePath));
        break;
      case 'input':
        instructions.push(createInputInstruction(step, key));
        break;
      default:
        throw new TemplateFormatError(`Invalid type for step ${key}. Got type ${step.type}`);
    }
  });
  return instructions;
}

class Parser {
  constructor(cli) {
    this.cli = cli;
  }

  parse(templateJson, templateBasePath) {
    const header = getHeader(templateJson);
    const instructions = getInstructions(templateJson, templateBasePath);
    this.cli.logVerbose('Successfully parsed template');

    return new Template(this.cli, header.name, instructions);
  }
}

module.exports = Parser;
