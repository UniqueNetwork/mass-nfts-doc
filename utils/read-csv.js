const fs = require('fs');
const CsvReadableStream = require('csv-reader');
const config = require('../config');

// Reads .csv file with NFTs attributes from {config.outputFolder}/{config.tokensCSV}

async function readCSV() {
  console.log('📖 Reading CSV...');
  const nftDataExist = fs.existsSync(`${config.dataDir}/${config.tokensCSV}`)
  if(!nftDataExist) {
    console.log('❌ Error: cannot find "data/nfts.csv"');
    process.exit(1);
  }
  let data = [];
  await new Promise((resolve) => {
    let inputStream = fs.createReadStream(`${config.dataDir}/${config.tokensCSV}`, 'utf8');

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
  data = data.splice(1).map(row => row.splice(1));
  return data;
}

module.exports = readCSV;