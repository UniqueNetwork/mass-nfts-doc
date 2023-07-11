const throwError = (message) => {
  console.log(`❌ Error: ${message}`);
  process.exit(1);
}

module.exports = throwError;
