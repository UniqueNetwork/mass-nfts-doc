const config = require('../config');
const fs = require('fs');
const path = require('path');
const { readAttributeNamesCsv } = require('./read-csv');

async function getConfig() {
  console.log(__dirname);

  if (fs.existsSync(path.resolve(__dirname, '../data/metadata.json'))) {
    config.collection.attributes = require('../data/metadata.json');
  } else {
    const attributes = await readAttributeNamesCsv();
    config.collection.attributes = attributes;
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
