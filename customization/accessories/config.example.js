const config = {
    endpoint: 'https://rest.unique.network/opal/v1',
    // Set your secret mnemonic phrase. Keep it save!
    ownerSeed: 'set your seed...',
    
    // Set desired collection attributes
    collection: {
        collectionId: '', // you will get the collection id after the step 2-create-collection.js
        fileUrl: '', // link to IPFS, you will get it after the step 1-upload-images.js
        
        name: 'Accessories collection',
        description: 'This collection demonstrates how to create customizable NFTs',
        // It is required that all NFT image names begin with the symbol, e.g. sa1.png, sa2.png ...
        symbol: 'ACC',

        customizableUrl: false, // set true only for the base customizable collection
        
        // To enable nesting set these properties:
        nesting: {
            tokenOwner: true,
            collectionAdmin: true,    
        }
    },

    // Extra configuration

    desiredCount: 30, // How many NFTs to generate. Used only for 0-generate-nfts.js
    coverFileName: 'cover.png', // Your cover should have this name. Save it in ./data folder
    numberOfTokensGeneratedAtOnce: 25,
    dataDir: './data',
    tokensCSV: 'nfts.csv',
    generationDir: './generate',
    attributesCsv: 'attributes.csv',
    nestingUrl: 'https://nesting.unique.network/common',
    imagesInParallel: require('os').cpus().length,
}

module.exports = config;
