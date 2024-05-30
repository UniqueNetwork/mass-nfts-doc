const { Sdk } = require("@unique-nft/sdk/full");
const { Sr25519Account } = require('@unique-nft/sr25519');
const config = require('../config');
const throwError = require("./errors");

/**
 * Initializes the Unique SDK with the provided configuration.
 * 
 * @returns {Promise<{sdk: Sdk, account: ISr25519Account}>} A promise that resolves to an object containing the initialized SDK and account.
 * @throws Will throw an error if the ownerSeed is missing or if the SDK cannot be initialized.
 */
async function initializeSdk() {
    if (!config.ownerSeed) {
        throwError('config.js - ownerSeed is empty. Did you forget to save the file?');
    }
    try {
        const account = Sr25519Account.fromUri(config.ownerSeed);

        const clientOptions = {
            baseUrl: config.endpoint,
            account,
        };

        const sdk = new Sdk(clientOptions);
        return {
            sdk,
            account
        };
    } catch (e) {
        throwError(`cannot initialize sdk: ${e.message}`);
    }
}

module.exports = initializeSdk;
