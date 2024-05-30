const { readNFTsCsv } = require('../utils/read-csv');
const { spawn, Pool, Worker } = require('threads');
const getConfig = require('./get-config');
const path = require('path');

let config;
let attributes;
let nfts;

/**
 * Retrieves image data paths based on NFT attributes.
 * 
 * @param {Array} arr - The array of attributes for an NFT.
 * @returns {Array<string>} An array of image paths.
 * @throws Will throw an error if an image index cannot be found.
 */
function getImageData(arr) {
  const images = [];

  for (let i = 0; i < arr.length; i++) {
    // If image part optional, it could be skipped
    if (arr[i] !== '') {
      const imageIdx = attributes[i].values.findIndex((v) => v === arr[i] || v.value === arr[i]) + 1;
      if (imageIdx === 0) throw new Error('imageIdx cannot be null');
      const img = `${config.generationDir}/${attributes[i].name}${imageIdx}.png`;
      images.push(img);
    }
  }

  return images;
}

/**
 * Generates images in parallel using a pool of workers.
 * 
 * @private
 * @returns {Promise<void>} A promise that resolves when all images are generated.
 */
async function _generateImages() {
  const pool = Pool(() => spawn(new Worker('./generate-images.worker.js')), config.imagesInParallel);

  for (let i = 0; i < nfts.length; i++) {
    const nft = nfts[i];
    const output = `${config.dataDir}/${config.collection.symbol.toLowerCase()}${i + 1}.png`;

    const images = getImageData(nft);

    pool.queue(async (generateImage) => {
      await generateImage({ images, output, num: i });
    });
  }

  await pool.completed();
  await pool.terminate();
}

/**
 * Main function to generate images based on NFT data.
 * 
 * @returns {Promise<void>} A promise that resolves when image generation is complete.
 */
async function generateImages() {
  console.log('🖼 generating images...');
  config = await getConfig();
  attributes = config.collection.attributes;
  nfts = await readNFTsCsv(path.resolve(config.dataDir, 'nfts.csv'));
  await _generateImages();
  console.log('🖼 generating images... done!');
  console.log('🖼 images folder: data');
}

module.exports = generateImages;
