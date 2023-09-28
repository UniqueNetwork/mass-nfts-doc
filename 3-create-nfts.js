const initializeSdk = require('./utils/initialize-sdk');
const {readNFTsCsv} = require('./utils/read-csv');
const throwError = require('./utils/errors');
const getConfig = require('./utils/get-config');

let nftdata;

async function main() {
  const config = await getConfig();

  nftdata = await readNFTsCsv();
  console.log('🚀 Creating NFTs...');

  const collectionId = config.collection.collectionId;
  if (!collectionId) {
    throwError('collectionId is not set in "config.js". Did you forget to save the file?')
  }

  const { sdk, signer } = await initializeSdk();

  // If user already minted some NFTs than continue starting from the last minted id
  const { tokenId: lastTokenId } = await sdk.collection.lastTokenId({ collectionId });
  const offset = lastTokenId || 0;
  if (nftdata.length <= offset) {
    console.log('✅ The desired number of tokens already created');
    return;
  }

  // Get data from csv and encode it to NFT attributes
  const data = Array(nftdata.length)
    .slice(offset || 0)
    .fill({})
    .map((el, i) => {
      const n = i + 1;
      const image = config.collection.customizable
        ? {url: `${config.nestingUrl}/${config.network}/${config.collection.collectionId}/${n}`}
        : { urlInfix: `${config.collection.symbol.toLowerCase()}${n}.png` }
      
      const file = { urlInfix: `${config.collection.symbol.toLowerCase()}${n}.png` }

      const encodedAttributes = {};
      nftdata[i].forEach((el, j) => {
        if (el) {
          const attributeValues = config.collection.attributes[j].values;
          if (attributeValues) {
            // If `values` has been set to attributes in config.js
            // attribute's value will be index of this value
            const imageIdx = attributeValues.findIndex(v => v === el || v.value === el) + 1;
            if(imageIdx === 0) {
              throwError(`Cannot find "${el}" among the attribute values "${attributeValues.join()}" in "config.js"`);
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
          file,
          encodedAttributes
        }
      }
    });

  // Minting transactions here
  let result = [];
  // do `config.numberOfTokensGeneratedAtOnce` number of transactions
  let chunkNumber = 0;
  while (result.length + offset < nftdata.length) {
    if (chunkNumber > nftdata.length / config.numberOfTokensGeneratedAtOnce) throw new Error('unexpected value chunkNumber');
    const chunkData = data.slice(chunkNumber * config.numberOfTokensGeneratedAtOnce, (chunkNumber + 1) * config.numberOfTokensGeneratedAtOnce);
    const { parsed, error } = await sdk.token.createMultiple.submitWaitResult({
      address: signer.address,
      collectionId: collectionId,
      tokens: chunkData
    }).catch(error => {
      
      throwError(`during NFTs minting: ${error.message}`);
    });

    if(error) {
      throwError(`during NFTs minting: ${error.message}`)
    }

    result = [ ...result, ...parsed];
    await new Promise(resolve => setTimeout(resolve, 1000));
    chunkNumber++;
    console.log(`🚚 successfully created ${chunkNumber} part of NFT's`);
  }

  console.log('🚀 Creating NFTs... done!');
  console.log(`Token Ids: ${result.map(el => el.tokenId).join(', ')}`);

  console.log(`\n🔗 You can find your collection and tokens here: https://uniquescan.io/${config.network}/collections/${config.collection.collectionId}`); 
}

main().catch(console.error).finally(() => process.exit());
