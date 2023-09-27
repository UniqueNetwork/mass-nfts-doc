const config = {
    endpoint: 'https://rest.unique.network/opal/v1',
    // Set your secret mnemonic phrase. Keep it save!
    ownerSeed: '',
    
    imagePrefix: 'cosmic_', // It is required that all NFT image names begin with prefix
    coverFileName: 'cover.png', // Your cover should have this name. Save it in ./data folder

    // Set desired collection attributes
    collection: {
        collectionId: '', // you will get the collection id after the step 2-create-collection.js
        fileUrl: '', // link to IPFS, you will get it after the step 1-upload-images.js
        
        name: 'Space Animals',
        description: 'This collection is created to showcase the process of mass minting',
        symbol: 'SANI',

        customizable: false, // set true only for base customizable collection
        
        // To enable nesting set these properties:
        nesting: {
            tokenOwner: false,
            collectionAdmin: false,    
        }
    },
    // How many NFTs to generate
    desiredCount: 100,

    // Extra configuration
    numberOfTokensGeneratedAtOnce: 25,
    dataDir: './data',
    tokensCSV: 'nfts.csv',
    generationDir: './generate',
    attributesCsv: 'attributes.csv',
    nestingUrl: 'https://nesting.unique.network/common',
    imagesInParallel: require('os').cpus().length,
}

module.exports = config;
