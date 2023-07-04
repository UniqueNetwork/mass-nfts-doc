const fs = require('fs');
const CsvReadableStream = require('csv-reader');
const config = require('../config');

// Reads .csv file with NFTs attributes from {config.outputFolder}/{config.tokensCSV}

async function readCSV() {
  console.log('📖 Reading CSV...');
  const data = [];
  await new Promise((resolve) => {
    let inputStream = fs.createReadStream(`${config.dataDir}/${config.tokensCSV}`, 'utf8');

    inputStream
      .pipe(new CsvReadableStream({ parseNumbers: true, parseBooleans: true, trim: true }))
      .on('data', function (row) {
          data.push(row);
          console.log('A row arrived: ', row);
      })
      .on('end', function () {
          console.log('📖 Reading CSV... done!');
          resolve();
      });
  })
  return data.splice(1);
}

module.exports = readCSV;