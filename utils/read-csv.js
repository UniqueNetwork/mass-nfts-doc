const fs = require('fs');
const CsvReadableStream = require('csv-reader');
const config = require('../config');
const throwError = require('./errors');

// Reads .csv file with NFTs attributes from {config.outputFolder}/{config.tokensCSV}

async function readCSV(path, removeRows, removeColumns) {
  console.log('📖 Reading CSV...');
  const nftDataExist = fs.existsSync(path)
  if(!nftDataExist) {
    throwError(`cannot find "${path}"`);
  }
  let data = [];
  await new Promise((resolve) => {
    let inputStream = fs.createReadStream(path, 'utf8');

    inputStream
      .pipe(new CsvReadableStream({ parseNumbers: true, parseBooleans: true, trim: true }))
      .on('data', function (row) {
          data.push(row);
      })
      .on('end', function () {
          console.log('📖 Reading CSV... done! Read tokens:', data.length - 1);
          resolve();
      });
  })

  // remove first row (header) and first column (id)
  data = data.splice(removeColumns).map(row => row.splice(removeRows));
  return data;
}

async function readNFTsCsv(pathToCsv) {
  if (!pathToCsv) pathToCsv = `${config.dataDir}/${config.tokensCSV}`;
  return readCSV(pathToCsv, 1, 1)
}

async function readAttributesCsv() {
  return readCSV(`${config.generationDir}/${config.attributesCsv}`, 0, 1)
}

module.exports = {readNFTsCsv, readAttributesCsv};