const config = {
    endpoint: 'https://rest.unique.network/opal/v1',
    ownerSeed: '', // Set your secret mnemonic phrase. Keep it save!

    imagePrefix: 'workoholic_', // All NFT images names must start with this prefix
    coverFileName: 'cover.png', // Your cover should have this name. Save it in ./data folder
    // TODO rename
    desiredCount: 5, // amount of NFTs to mint

    // Set desired collection attributes
    collection: {
        name: 'Minting Workshop',
        description: 'How to create a large NFT collection: <TODO link>',
        tokenPrefix: 'MINT',

        attributes: [
            { name: 'eye', required: true, values: ['Normal Eyes', 'Tired Eyes', 'Brused Eyes'] },
            { name: 'hair', required: false, values: ['Normal Hair', 'Hipster Style', 'Messy Hair', 'Overdue for Haircut', 'Bald Patches'] },
            { name: 'nickname', required: true }
        ],

        fileUrl: '', // link to IPFS, you will get it after the step 1-upload-images.js
        collectionId: '', // you will get the collection id after the step 2-create-collection.js

        // To enable nesting set these properties:
        nesting: {
            tokenOwner: false,
            collectionAdmin: false,    
        }
    },

    // Extra configuration
    numberOfTokensGeneratedAtOnce: 25,
    outputFolder: './data',
    tokensCSV: 'nfts.csv',
    imagesInParallel: require('os').cpus().length,
}

module.exports = config;
