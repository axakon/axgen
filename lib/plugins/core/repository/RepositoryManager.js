const Path = require('path');
const fs = require('fs');
const Parser = require('../parser/Parser');
const Repository = require('./Repository');

class RepositoryManager {
  constructor() {
    this.repositories = [];
  }

  initiate(cli) {
    const createDefaultRepository = () => {
      const defaultTemplatesPath = Path.join(Path.dirname(require.main.filename), '..', 'templates');
      return this.discoverRepositories(defaultTemplatesPath, 'Default');
    };

    this.cli = cli;
    this.parser = new Parser(cli);
    this.repositories = [createDefaultRepository()];

    this.cli.logVerbose('Current repos', this.repositories);
  }

  /**
 * Discovers and repository in a folder and their sub folders
 * @param {*} path
 */
  // eslint-disable-next-line class-methods-use-this
  discoverRepositories(path, name) {
    const getTemplatesFromPath = (templateDirPath) => {
      const jsonFiles = fs.readdirSync(templateDirPath, {
        withFileTypes: true,
      }).filter(file => !file.isDirectory() && file.name.match(/.+\.json/))
        .map(file => file.name);
      const templates = [];
      for (const fileName of jsonFiles) {
        const file = fs.readFileSync(Path.join(templateDirPath, fileName), {
          encoding: 'UTF-8',
        });
        try {
          const jsonFile = JSON.parse(file);
          const template = this.parser.parse(jsonFile, templateDirPath);
          this.cli.logVerbose(`Discovered template ${template.name} in ${templateDirPath}`);
          templates[template.name] = template;
        } catch (error) {
          this.cli.logVerbose(`Discovered a non-template file: ${file}`, error);
        }
      }
      return templates;
    };

    this.cli.logVerbose(`Reading: ${path}`);
    let folders = [path];
    const subFolders = fs.readdirSync(path, {
      withFileTypes: true,
    }).filter(dir => dir.isDirectory())
      .map(dir => Path.join(path, dir.name));
    folders = folders.concat(subFolders);
    let templates = [];

    this.cli.logVerbose(`Will be checking ${folders.length} folders`, folders);

    //  todo: Scan previous additions so we dont override any existing templates!
    for (const folderPath of folders) {
      templates = Object.assign({}, templates, getTemplatesFromPath(folderPath));
    }
    return new Repository(templates, name, path);
  }

  getTemplate(name) {
    //  support repo@template naming if multiple repos contain the same name
    for (const repository of this.repositories) {
      const template = repository.getTemplate(name);
      if (template) {
        return template;
      }
    }
    return null;
  }
}

module.exports = new RepositoryManager();
