const fs = require('fs');

/**
 * Uploads images to IPFS using the provided SDK and zip file path.
 * 
 * @param {Object} sdk - The SDK instance to use for uploading.
 * @param {string} zipPath - The path to the zip file containing the images.
 * @returns {Promise<string>} A promise that resolves to the file URL of the uploaded images.
 * @throws Will throw an error if the upload fails.
 */
async function uploadImages(sdk, zipPath) {
    try {
        console.log('🚀 Uploading images...');
        const { fileUrl } = await sdk.ipfs.uploadZip({ file: fs.readFileSync(zipPath) });

        console.log('🚀 Uploading images... done!');
        console.log(`❗️❗️❗️ add to "config.js" fileUrl: "${fileUrl}"`);
        return fileUrl;
    } catch (e) {
        throw new Error(`error, upload images: ${e.message}`);
    }
}

module.exports = uploadImages;
