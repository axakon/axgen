
class Repository {
  constructor(templates, name, rootPath) {
    this.templates = templates || [];
    this.name = name;
    this.rootPath = rootPath;
  }

  getTemplate(name) {
    return this.templates[name];
  }
}

module.exports = Repository;
