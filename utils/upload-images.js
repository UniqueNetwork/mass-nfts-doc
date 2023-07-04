const fs = require('fs');

async function uploadImages(sdk, zipPath) {
    try {
        console.log('🚀 Upload images...');
        const { fileUrl } = await sdk.ipfs.uploadZip({ file: fs.readFileSync(zipPath) });

        console.log(`🚀 Upload images... done!`);
        console.log(`❗️❗️❗️ add to config.js: fileUrl: "${fileUrl}"`);
        return fileUrl;
    } catch (e) {
        throw new Error(`error upload images: ${e}`);
    }
}

module.exports = uploadImages;
