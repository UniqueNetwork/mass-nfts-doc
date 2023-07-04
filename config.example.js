const config = {
    endpoint: 'https://rest.unique.network/opal/v1',
    ownerSeed: '', // Set your secret mnemonic phrase. Keep it save!

    imagePrefix: 'cosmic_', // It is required that all NFT image names begin with prefix
    coverFileName: 'cover.png', // Your cover should have this name. Save it in ./data folder

    // Set desired collection attributes
    collection: {
        name: 'Space Animals',
        description: 'This collection is created to showcase the process of mass minting',
        tokenPrefix: 'SANI',

        fileUrl: '', // link to IPFS, you will get it after the step 1-upload-images.js
        collectionId: '', // you will get the collection id after the step 2-create-collection.js

        // Each NFT token will have these properties.
        // Feel free to set your own
        attributes: [
            'creature',
            'description',
        ],

        // You can create more complex rules for each attribute
        // set attributes as an object with the `name`, `required` and `values` properties
        // Example:

            // attributes: [
            //     { name: 'creature', required: true, values: ['Mammal', 'Reptiles', 'Birds'] },
            //     { name: 'description', required: false }
            // ],

        // To enable nesting set these properties:
        nesting: {
            tokenOwner: false,
            collectionAdmin: false,    
        }
    },

    // Extra configuration
    numberOfTokensGeneratedAtOnce: 25,
    dataDir: './data',
    tokensCSV: 'nfts.csv',
    imagesInParallel: require('os').cpus().length,
}

module.exports = config;
