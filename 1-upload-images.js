const initializeSdk = require('./utils/initialize-sdk');
const createZipArchive = require('./utils/create-zip');

async function main() {
  const zipPath = await createZipArchive();

  const sdk = await initializeSdk();
}

main().catch(console.error);