const fs = require('fs');
const CsvReadableStream = require('csv-reader');
const config = require('../config');
const throwError = require('./errors');

/**
 * Reads a CSV file and processes its data.
 * 
 * @param {string} path - The path to the CSV file.
 * @param {number} removeRows - Number of rows to remove from the start.
 * @param {number} removeColumns - Number of columns to remove from the start.
 * @returns {Promise<Array>} A promise that resolves to the processed CSV data.
 * @throws Will throw an error if the file does not exist.
 */
async function readCSV(path, removeRows, removeColumns) {
  console.log('📖 Reading CSV...');
  const nftDataExist = fs.existsSync(path);
  if (!nftDataExist) {
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
  });

  // Remove specified number of rows and columns
  data = data.splice(removeColumns).map(row => row.splice(removeRows));
  return data;
}

/**
 * Reads the NFTs CSV file.
 * 
 * @param {string} [pathToCsv] - Optional path to the CSV file.
 * @returns {Promise<Array>} A promise that resolves to the NFTs data.
 */
async function readNFTsCsv(pathToCsv) {
  if (!pathToCsv) pathToCsv = `${config.dataDir}/${config.tokensCSV}`;
  return readCSV(pathToCsv, 1, 1);
}

/**
 * Reads the attributes CSV file.
 * 
 * @returns {Promise<Array>} A promise that resolves to the attributes data.
 */
async function readAttributesCsv() {
  return readCSV(`${config.generationDir}/${config.attributesCsv}`, 0, 1);
}

/**
 * Reads the attribute names from the CSV file.
 * 
 * @returns {Promise<Array>} A promise that resolves to the attribute names.
 */
async function readAttributeNamesCsv() {
  const csv = await readCSV(`${config.dataDir}/${config.tokensCSV}`, 1, 0);
  return csv[0];
}

module.exports = { readNFTsCsv, readAttributesCsv, readAttributeNamesCsv };
