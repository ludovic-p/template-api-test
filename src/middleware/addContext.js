/**
 * Add the context to
 * @param {Object} app - Express application
 * @returns {Array.<Function>} function containing the Express routes
 */
const addContextToRoutes = (requiredFile, app) => {
  Object.keys(requiredFile).forEach((fn) => {
    return requiredFile[ fn ](app);
  })
};

module.exports = addContextToRoutes;