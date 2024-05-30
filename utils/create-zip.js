const AdmZip = require('adm-zip');
const path = require('path');
const { readNFTsCsv } = require('./read-csv');
const config = require('../config');
const throwError = require('./errors');

let images;

/**
 * Creates a zip archive containing NFT images and a cover image.
 * 
 * @returns {Promise<string>} A promise that resolves to the path of the created zip archive.
 * @throws Will throw an error if the zip archive cannot be created.
 */
async function createZipArchive() {
  console.log('📦 adding images to a zip archive...');
  images = await readNFTsCsv();

  try {
    // Path where to store zip
    const zipPath = path.resolve(config.dataDir, 'archive.zip');

    const zip = new AdmZip();

    // Save cover to archive
    if (config.coverFileName) {
      zip.addLocalFile(path.resolve(config.dataDir, config.coverFileName));
    }

    const indexes = Array.from({ length: images.length }, (_, i) => i + 1);
    indexes.forEach((i) => {
      const tokenImg = images[i - 1];
      if (tokenImg) {
        zip.addLocalFile(path.resolve(config.dataDir, `${config.collection.symbol.toLowerCase()}${i}.png`));
      }
    });

    zip.writeZip(zipPath);
    console.log('📦 adding images to a zip archive... done!');
    return zipPath;
  } catch (e) {
    throwError(`cannot create zip: ${e.message}`);
  }
}

module.exports = createZipArchive;
