const TemplateFormatError = require('../../../../errors/TemplateFormatError');

class Input {
  constructor(name, parameters) {
    this.name = name;
    this.prompts = parameters;
  }

  async execute(cli, context) {
    const newContext = context;
    if (!context.params) {
      newContext.params = [];
    }

    for (const prompt of this.prompts) {
      cli.logInformation(prompt.description);
      // eslint-disable-next-line no-await-in-loop
      newContext.params[prompt.name.toLowerCase()] = await cli.waitForInput(prompt.name);
    }
    return newContext;
  }
}

function createFromJsonStep(jsonStep, name) {
  let { parameters } = jsonStep;
  if (!parameters || parameters.length === 0) {
    throw new TemplateFormatError(`${name} is missing or contains no parameters. Requires at least 1 parameter`);
  }

  parameters = parameters.map(param => ({
    name: param.name,
    description: param.description,
  }));
  return new Input(name, parameters);
}

module.exports = {
  Input,
  createFromJsonStep,
};
