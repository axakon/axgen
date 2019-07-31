const Path = require('path');
const fs = require('fs');
const TemplateFormatError = require('../../../../errors/TemplateFormatError');

class Copy {
  constructor(name, files, output) {
    this.name = name;
    this.files = files;
    this.output = output;
  }

  //  todo: Clean up this function, it is super messy!
  async execute(cli, context) {
    const absoluteOutputPath = Path.join(context.outputBasePath, this.output);
    const parameters = context.params;
    cli.logVerbose(`Outputting to: ${absoluteOutputPath}`);

    for (const file of this.files) {
      const outputPath = Path.join(absoluteOutputPath, Path.basename(file));
      if (fs.existsSync(outputPath)) {
        throw new Error(`${file} already exists at ${outputPath}.`);
      }

      cli.logVerbose(`Copying file at ${file} to ${outputPath}`);
      fs.mkdirSync(absoluteOutputPath, { recursive: true });

      let fileContent = fs.readFileSync(file, 'utf8');

      const regex = /(\${([^\s]+))}(?!.*\1)/ig;
      const variables = fileContent.match(regex) || [];
      for (const variable of variables) {
        const formattedVariable = variable.slice(2, variable.length - 1).toLowerCase();
        if (!parameters[formattedVariable]) {
          cli.logInformation(`Warning! Missing parameter to replace ${variable}`);
        } else {
          cli.logVerbose(`Replacing variable ${variable} with ${parameters[formattedVariable]}`);
          fileContent = fileContent.replace(variable, parameters[formattedVariable]);
        }
      }

      fs.writeFileSync(outputPath, fileContent, {
        encoding: 'utf8',
      });
    }
    return context;
  }
}

function createFromJsonStep(jsonStep, name, templateBasePath) {
  let filesToCopy = jsonStep.files;
  const { output } = jsonStep;

  if (!filesToCopy || filesToCopy.length === 0) {
    throw new TemplateFormatError(`${name} is missing or contains an empty files field. Requires at least 1 file to copy`);
  }

  if (!filesToCopy.every(file => typeof file === 'string')) {
    throw new TemplateFormatError(`${name} contains invalid files. Only supports strings`);
  }

  filesToCopy = filesToCopy.map((file) => {
    const absoluteFilePath = Path.join(templateBasePath, file);
    if (!fs.existsSync(absoluteFilePath)) {
      throw new TemplateFormatError(`${name} contains files to copy that doesn't exist. Missing file ${file} at ${templateBasePath}`);
    }
    return absoluteFilePath;
  });

  if (!output) {
    throw new TemplateFormatError(`${name} is missing an output path. Minimum is the root path (".")`);
  }

  return new Copy(name, filesToCopy, output);
}

module.exports = {
  Copy,
  createFromJsonStep,
};
