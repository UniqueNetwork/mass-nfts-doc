const Sdk = require("@unique-nft/sdk");
const { KeyringProvider } = require("@unique-nft/accounts/keyring");
const config = require('../config');
const { throwError } = require("./errors");

async function initializeSdk() {
    if(!config.ownerSeed) {
        throwError('config.js - ownerSeed is empty. Did you forget to save the file?');
    }
    try {
        const provider = new KeyringProvider({ type: 'sr25519' });
        await provider.init();
        const signer = provider.addSeed(config.ownerSeed);

        const clientOptions = {
            baseUrl: config.endpoint,
            signer
        };
        return {
            sdk: new Sdk.default(clientOptions),
            signer
        };
    } catch (e) {
        throw new Error(`error initialize sdk: ${e}`);
    }
}

module.exports = initializeSdk;
