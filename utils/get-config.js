const config = require('../config');
const fs = require('fs');
const path = require('path');

function getConfig() {
  console.log(__dirname);
  if (fs.existsSync(path.resolve(__dirname, '../data/metadata.json'))) {
    config.collection.attributes = require('../data/metadata.json');
  };
  return config;
}

module.exports = getConfig;
