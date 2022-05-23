const fs = require("fs");

/**
 * Load all files from 'routes' directory and add the Express object to route functions
 * @param {Object} app - Express application
 * @returns {Array.<Function>} function containing the Express routes
 */
const loadRoutes = (app) => {
  const logs = [];
  logs.push('\x1b[34mLoading of Routes:\x1b[0m');
  const validModels = fs.readdirSync(__dirname).reduce((acc, filename) => {
    if (filename !== 'index.js' && /[a-zA-Z0-9\-]*.js$/.test(filename)) {
      const requiredFile = require(`${__dirname}/${filename}`);
      if (typeof requiredFile === 'function') {
        logs.push(`   \x1b[34m- ${filename} loaded\x1b[0m`);
        const requiredFileWithContext = requiredFile(app);
        return acc.concat(requiredFileWithContext);
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

module.exports = loadRoutes;