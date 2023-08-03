const {readNFTsCsv} = require('../utils/read-csv');
const {spawn, Pool, Worker} = require('threads');
const getConfig = require('./get-config');
const path = require('path');

let attributes
let nfts;
let config = getConfig();

function getImageData(arr) {
  const images = [];

  for (let i=0; i < arr.length; i++) {
    // if image part optional it could be skipped
    if (arr[i] !== '') {
      const imageIdx = attributes[i].values.findIndex((v) => v === arr[i] || v.value === arr[i]) + 1;
      if(imageIdx === 0) throw Error('imageIdx cannot be null');
      const img = {
        src: `${config.generationDir}/${attributes[i].name}${imageIdx}.png`,
        offsetX: (i == 0) ? 0 : -config.imageWidth,
        offsetY: 0,
      };
      images.push(img);
    }
  }

  return images;
}

async function _generateImages() {
  const pool = Pool(() => spawn(new Worker('./generate-images.worker.js')), config.imagesInParallel);

  for (let i = 0; i < nfts.length; i++) {
    const nft = nfts[i];
    const output = `${config.dataDir}/${config.imagePrefix}${i+1}.png`;

    const images = getImageData(nft);

    pool.queue(async (generateImage) => {
      await generateImage({images, output, num: i});
    });
  }

  await pool.completed();
  await pool.terminate();
}

async function generateImages() {
  console.log('🖼 generating images...');
  attributes = config.collection.attributes;
  nfts = await readNFTsCsv(path.resolve(config.dataDir, 'nfts.csv'));
  await _generateImages();
  console.log('🖼 generating images... done!');
  console.log('🖼 images folder: data');
}

module.exports = generateImages;
