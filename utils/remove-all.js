const config = require("../config");
const throwError = require("./errors");
const initializeSdk = require("./initialize-sdk");

const main = async () => {
  const { sdk, signer } = await initializeSdk();

  let collectionId = config.collection.collectionId;
  if (!collectionId) {
    collectionId = prompt('enter collection id')
  }

  const lastTokenId = await sdk.collection.lastTokenId({collectionId});

  for (let tokenId = 1; tokenId <= lastTokenId; tokenId++) {
    const exist = await sdk.token.exists({ collectionId, tokenId })
    if (exist) {
      await sdk.token.burn({
        collectionId, tokenId, address: signer.address
      })
    }
  }
}

main().catch(e => {
  throwError(e.message);
})