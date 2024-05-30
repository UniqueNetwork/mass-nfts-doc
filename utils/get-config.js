const config = require('../config');
const fs = require('fs');
const path = require('path');
const { readAttributeNamesCsv } = require('./read-csv');

/**
 * Loads the configuration, including attributes and network details.
 * 
 * @returns {Promise<Object>} A promise that resolves to the configuration object.
 */
async function getConfig() {
  console.log(__dirname);

  const metadataPath = path.resolve(__dirname, '../data/metadata.json');
  if (fs.existsSync(metadataPath)) {
    config.collection.attributes = require(metadataPath);
  } else {
    const attributes = await readAttributeNamesCsv();
    config.collection.attributes = attributes;
  }

  const network = config.endpoint.includes('opal')
    ? 'opal'
    : config.endpoint.includes('quartz')
      ? 'quartz'
      : 'unique';
  config.network = network;

  return config;
}

module.exports = getConfig;
