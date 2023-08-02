const config = require('../config');
const fs = require('fs');
const path = require('path');

function getConfig() {
  console.log(__dirname);
  if (fs.existsSync(path.resolve(__dirname, '../attributes.json'))) {
    config.collection.attributes = require('../attributes.json');
  };
  return config;
}

module.exports = getConfig;
