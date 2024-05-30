const { convertArrayToCSV } = require('convert-array-to-csv');
const fs = require('fs');
const path = require('path');
const config = require('./config');
const formatAttributes = require('./utils/format-attributes');
const generateImages = require('./utils/generate-images');

/**
 * Generates a random integer between 0 and the specified max value.
 * 
 * @param {number} max - The maximum value for the random integer.
 * @returns {number} A random integer.
 */
function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

/**
 * Selects an attribute value based on its weighted chance.
 * 
 * @param {Object} attribute - The attribute object.
 * @returns {string|undefined} The selected attribute value.
 */
function selectAttribute(attribute) {
  const weightedValues = [];
  if (attribute.chance < 100) {
    weightedValues.push(...new Array(100 - parseInt(attribute.chance)).fill(undefined));
  }
  for (const value of attribute.values) {
    weightedValues.push(...new Array(parseInt(value.weight)).fill(value.value));
  }
  const random = getRandomInt(weightedValues.length);
  return weightedValues[random];
}

/**
 * Generates attributes for a single NFT.
 * 
 * @param {Array} attributes - The array of attributes.
 * @returns {Array} An array of selected attributes for the NFT.
 */
function getNFTAttributes(attributes) {
  const nft = [];
  for (const attribute of attributes) {
    nft.push(selectAttribute(attribute));
  }
  return nft;
}

/**
 * Generates NFT data and saves it to a CSV file.
 * 
 * @param {Array} attributes - The array of attributes.
 */
function generateNftsData(attributes) {
  const NFT_DATA_PATH = path.resolve(config.dataDir, 'nfts.csv');

  const nfts = new Array(config.desiredCount)
    .fill(undefined).map((_v, i) => [i + 1, ...getNFTAttributes(attributes)]);

  const nftsToCSV = convertArrayToCSV(nfts, {
    separator: ',',
    header: ['id', ...attributes.map((attr) => attr.name)],
  });
  fs.writeFileSync(NFT_DATA_PATH, nftsToCSV);
  console.log(`💾 Nft data saved: ${NFT_DATA_PATH}`);
}

/**
 * Main function to generate NFTs, format attributes, and generate images.
 * 
 * @returns {Promise<void>} A promise that resolves when all tasks are complete.
 */
async function generateNFTs() {
  if (fs.existsSync(config.dataDir)) {
    fs.rmSync(config.dataDir, { recursive: true, force: true });
    fs.mkdirSync(config.dataDir);
  } else {
    fs.mkdirSync(config.dataDir);
  }

  const attributes = await formatAttributes();
  generateNftsData(attributes);
  await generateImages();

  const coverFilePath = path.resolve(config.generationDir, config.coverFileName);
  if (fs.existsSync(coverFilePath)) {
    fs.copyFileSync(
      coverFilePath,
      path.resolve(config.dataDir, config.coverFileName)
    );
  }
}

generateNFTs().catch(console.error);
