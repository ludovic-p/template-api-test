const fs = require("fs");

const loadModels = () => {
  const logs = [];
  logs.push('\x1b[34mLoading of Models:\x1b[0m');
  const validModels = fs.readdirSync(__dirname).reduce((acc, filename) => {
    if (filename !== 'index.js' && /[a-zA-Z0-9\-]*.js$/.test(filename)) {
      const requiredFile = require(`${__dirname}/${filename}`);
      if (requiredFile.name && requiredFile.model) {
        logs.push(`   \x1b[34m- ${filename} loaded\x1b[0m`);
        return acc.concat(requiredFile);
      }
      logs.push(`   \x1b[31m- ${filename} can be treated\x1b[0m`);
    }
    return acc;
  }, []);
  logs.forEach((log) => {
    console.log(log);
  });
  return validModels;
};

module.exports = loadModels;