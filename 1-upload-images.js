const initializeSdk = require('./utils/initialize-sdk');
const createZipArchive = require('./utils/create-zip');
const uploadImages = require('./utils/upload-images');
const config = require('./config');

/**
 * Main function to create a zip archive of images, initialize the SDK, and upload images.
 * 
 * @returns {Promise<void>} A promise that resolves when all tasks are complete.
 */
async function main() {
  if (config.collection.fileUrl) {
    console.log(
      '❗️❗️❗️ you already have a link in config.js fileUrl:',
      config.collection.fileUrl
    );
    return;
  }
  
  const zipPath = await createZipArchive();

  const { sdk } = await initializeSdk();
  await uploadImages(sdk, zipPath);
}

main().catch(console.error);
