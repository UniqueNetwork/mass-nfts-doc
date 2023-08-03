const config = require('../config');
const fs = require('fs');
const path = require('path');

function getConfig() {
  console.log(__dirname);
  if (fs.existsSync(path.resolve(__dirname, '../metadata.json'))) {
    config.collection.attributes = require('../metadata.json');
  };
  return config;
}

module.exports = getConfig;
