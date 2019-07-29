
class Template {
  constructor(cli, name, instructions) {
    this.cli = cli;
    this.name = name;
    this.instructions = instructions;
  }

  async execute(basePath) {
    let context = {
      outputBasePath: basePath,
    };
    this.cli.logInformation(`Executing template ${this.name}`);
    for (const instruction of this.instructions) {
      this.cli.logVerbose(`Running instruction ${instruction.name}`);
      // we depend on the order of the execution.
      // eslint-disable-next-line no-await-in-loop
      context = await instruction.execute(this.cli, context);
      this.cli.logVerbose(`After instruction ${instruction.name}, context state is`, context);
    }
  }

  setTemplateBasePath(path) {
    this.templateBasePath = path;
  }

  setOutputBasePath(path) {
    this.outputBasePath = path;
  }
}

module.exports = Template;
