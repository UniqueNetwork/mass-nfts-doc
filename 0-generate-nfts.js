// @ts-ignore
const {convertArrayToCSV} = require('convert-array-to-csv');
const fs = require('fs');
const path = require('path');
const config = require('./config');
const formatAttributes = require('./utils/format-attributes');
const generateImages = require('./utils/generate-images');


function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

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

function getNFTAttributes(attributes) {
  const nft = [];
  for (const attribute of attributes) {
    nft.push(selectAttribute(attribute));
  }
  return nft;
}

function generateNftsData(attributes) {
  const NFT_DATA_PATH = path.resolve(config.dataDir, 'nfts.csv');

  const nfts = new Array(config.desiredCount)
    .fill(undefined).map((_v, i) => [i+1, ...getNFTAttributes(attributes)]);

  const nftsToCSV = convertArrayToCSV(nfts, {
    separator: ',',
    header: ['id', attributes.map((attr) => attr.name)],
  });
  fs.writeFileSync(NFT_DATA_PATH, nftsToCSV);
  console.log(`💾 Nft data saved: ${NFT_DATA_PATH}`);
}

async function generateNFTs() {
  if (fs.existsSync(config.dataDir)) {
    fs.rmSync(config.dataDir, {recursive: true, force: true});
    fs.mkdirSync(config.dataDir);
  } else {
    fs.mkdirSync(config.dataDir);
  }

  const attributes = await formatAttributes();
  generateNftsData(attributes);
  await generateImages();

  if (fs.existsSync(path.resolve(config.generationDir, config.coverFileName))) {
    fs.copyFileSync(
      path.resolve(config.generationDir, config.coverFileName), 
      path.resolve(config.dataDir, config.coverFileName)
    );
  }
}

generateNFTs().catch(console.error);
