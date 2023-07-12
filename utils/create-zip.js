const AdmZip = require('adm-zip');
const path = require('path');
const readCSV = require('./read-csv');
const config = require('../config');
const throwError = require('./errors');

// Creates a zip archive with `images.length` prefixed images and cover.png
// Images should be stored in config.dataDir directory (`data` by default)

let images;

async function createZipArchive() {
  console.log('📦 adding images to a zip archive...')
  images = await readCSV();

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

    const indexes = Array.from({ length: images.length },(_, i) => i+1);
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
      throwError(`cannot create zip: ${e.message}`);
  }
}

module.exports = createZipArchive;
