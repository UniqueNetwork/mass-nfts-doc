/**
 * Logs an error message to the console and exits the process.
 *
 * @param {string} message - The error message to be logged.
 */
const throwError = (message) => {
  console.log(`❌ Error: ${message}`);
  process.exit(1);
}

module.exports = throwError;
