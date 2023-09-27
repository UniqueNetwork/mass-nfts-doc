const config = require('../config');
const fs = require('fs');
const path = require('path');

function getConfig() {
  console.log(__dirname);
  if (fs.existsSync(path.resolve(__dirname, '../data/metadata.json'))) {
    config.collection.attributes = require('../data/metadata.json');
  };
  let network = config.endpoint.includes('opal')
    ? 'opal'
    : config.endpoint.includes('quartz')
      ? 'quartz'
      : 'unique';
  config.network = network;
  return config;
}

module.exports = getConfig;
