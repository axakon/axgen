

module.exports.createPlugin = (name, plugin) => ({
  plugin,
  name,
});

module.exports.getSubCommands = (commands) => {
  if (commands.length === 1) {
    return [];
  }
  return commands.slice(1, commands.length);
};
