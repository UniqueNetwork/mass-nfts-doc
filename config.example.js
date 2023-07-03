const config = {
    endpoint: 'https://rest.unique.network/opal/v1',
    ownerSeed: '', // Set your secret mnemonic phrase. Keep it save!

    imagePrefix: 'workoholic_', // All NFT images names must start with this prefix
    coverFileName: 'cover.png', // Your cover should have this name. Save it in ./data folder
    desiredCount: 5, // amount of NFTs to mint

    // Set desired collection attributes
    collection: {
        name: 'Minting Workshop',
        description: 'How to create a large NFT collection: <TODO link>',
        tokenPrefix: 'MINT',

        attributes: [
            { name: 'head', required: true, values: ['Regular Head'] },
            { name: 'eye', required: true, values: ['Normal Eyes', 'Tired Eyes', 'Brused Eyes'] },
            { name: 'brow', required: true, values: ['Thick Brows', 'Greyish Brows', 'Flat Brows'] },
            { name: 'nose', required: true, values: ['Snub Nose', 'Button Nose', 'Droopy Nose'] },
            { name: 'hair', required: false, values: ['Normal Hair', 'Hipster Style', 'Messy Hair', 'Overdue for Haircut', 'Bald Patches'] },
            { name: 'mouth', required: true, values: ['Smirk', 'Regular Smile', 'Wide Smile'] }
        ],
    },

    // Extra configuration
    numberOfTokensGeneratedAtOnce: 25,
    outputFolder: './data',
    tokensCSV: 'nfts.csv',
    imagesInParallel: require('os').cpus().length,
}

module.exports = config;
