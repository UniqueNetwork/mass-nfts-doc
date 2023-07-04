const initializeSdk = require('./utils/initialize-sdk');
const readCSV = require('./utils/read-csv');
const config = require('./config');

let nftdata;

async function main() {
  nftdata = await readCSV(`${config.outputFolder}/nfts.csv`);
  console.log('🚀 Creating NFTs...');

  const collectionId = config.collection.collectionId;
  if (!collectionId) {
    console.log('❌ Error: collectionId is not set in "config.js"');
    process.exit(1);
  }

  const { sdk, signer } = await initializeSdk();

  // If user already minted some NFTs than continue starting from the last minted id
  const { tokenId: lastTokenId } = await sdk.collection.lastTokenId({ collectionId });
  const offset = lastTokenId || 0;
  if (config.desiredCount <= offset) {
    console.log('✅ The desired number of tokens already created');
    return;
  }

  // Desired count cannot be greater than NFT's described in nfts.csv
  if (config.desiredCount > nftdata.length) {
    console.log('❌ Error: The desired number of tokens is more than tokens in "nfts.csv"');
    process.exit(1);
  }

  // Get data from csv and encode it to NFT attributes
  const data = Array(config.desiredCount)
    .slice(offset || 0)
    .fill({})
    .map((el, i) => {
      const n = i + 1;
      const image = { urlInfix: `${config.imagePrefix}${n}.png`};
      const encodedAttributes = {};
      nftdata[i].forEach((el, j) => {
        if (el) {
          const attributeValues = config.collection.attributes[j].values;
          if (attributeValues) {
            // If `values` has been set to attributes in config.js
            // attribute's value will be index of this value
            const imageIdx = attributeValues.findIndex(v => v === el || v.value === el) + 1;
            if(imageIdx === 0) {
              console.log(`❌ Error: Cannot find "${el}" among the attribute values "${attributeValues.join()}" in "config.js"`)
              process.exit(1);
            }
            encodedAttributes[j] = imageIdx - 1;
          } else {
            // else attribute's value will be value from .csv as is
            encodedAttributes[j] = {_: el};
          }
        }
      });
      return {
        data: {
          image,
          encodedAttributes
        }
      }
    });

  // Minting transactions here
  let result = [];
  // do `config.numberOfTokensGeneratedAtOnce` number of transactions
  let chunkNumber = 0;
  while (result.length + offset < config.desiredCount) {
    if (chunkNumber > config.desiredCount / config.numberOfTokensGeneratedAtOnce) throw new Error('unexpected value chunkNumber');
    const chunkData = data.slice(chunkNumber * config.numberOfTokensGeneratedAtOnce, (chunkNumber + 1) * config.numberOfTokensGeneratedAtOnce);
    const { parsed, error } = await sdk.token.createMultiple.submitWaitResult({
      address: signer.address,
      collectionId: collectionId,
      tokens: chunkData
    });

    if(error) {
      console.log('❌ Error during NFTs minting:', error.message);
      process.exit(1);
    }

    result = [ ...result, ...parsed];
    await new Promise(resolve => setTimeout(resolve, 1000));
    chunkNumber++;
    console.log(`🚚 successfully created ${chunkNumber} part of NFT's`);
  }

  console.log('🚀 Creating NFTs... done!');
  console.log(`Token Ids: ${result.map(el => el.tokenId).join(', ')}`);

  let network = config.endpoint.includes('opal')
    ? 'opal'
    : config.endpoint.includes('quartz')
      ? 'quartz'
      : 'unique'
  console.log(`\n🔗 You can find it here: https://uniquescan.io/${network}/collections/${config.collection.collectionId}`); 
}

main().catch(console.error).finally(() => process.exit());
