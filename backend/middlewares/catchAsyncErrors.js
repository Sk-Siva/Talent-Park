/**
 * Middleware to catch and handle async errors in Express routes.
 * 
 * @param {Function} theFunction - The async function to be executed.
 * @returns {Function} - A middleware function that catches errors and passes them to Express error handling.
 */
export const catchAsyncErrors = (theFunction) => (req, res, next) => {
  Promise.resolve(theFunction(req, res, next)).catch(next);
};
