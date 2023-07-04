const AdmZip = require('adm-zip');
const path = require('path');
const readCSV = require('./read-csv');
const config = require('../config');

// Creates a zip archive with `config.desiredCount` prefixed images and cover.png
// Images should be stored in config.outputFolder directory (./data by default)

let images;

async function createZipArchive() {
  console.log('📦 adding images to a zip archive...')
  images = await readCSV();
  if(images.length < config.desiredCount) {
    console.log('❌ Error: Total NFTs in .csv less than config.desiredCount');
    process.exit(1);
  }

  try {
    // path where to store zip
    const zipPath = path.resolve(
        config.dataDir,
        'archive.zip',
    );

    const zip = new AdmZip();

    // Save cover to archive
    if (config.coverFileName) {
        zip.addLocalFile(path.resolve(
            config.dataDir,
            config.coverFileName,
        ));
    }

    const indexes = Array.from({ length: config.desiredCount },(_, i) => i+1);
    indexes.forEach((i) => {
        const tokenImg = images[i-1];
        if (tokenImg) {
            zip.addLocalFile(path.resolve(
                config.dataDir,
                `${config.imagePrefix}${i}.png`,
            ));
        }
    });

    zip.writeZip(zipPath);
    console.log('📦 adding images to a zip archive... done!');
    return zipPath;
  } catch (e) {
      throw new Error(`error creating zip: ${e}`);
  }
}

module.exports = createZipArchive;
