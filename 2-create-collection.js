const initializeSdk = require('./utils/initialize-sdk');
const throwError = require('./utils/errors');
const getConfig = require('./utils/get-config');

let config;

/**
 * Encodes attributes from the configuration file to create a collection input data structure.
 * 
 * @returns {Object} The collection input data structure.
 */
function encodeAttributes() {
  // Basic data structure for creating a collection in Unique
  // We already set some values from `config.js`
  const collectionInputData = {
    mode: 'Nft',
    name: config.collection.name,                 // Collection name
    description: config.collection.description,   // Collection description
    tokenPrefix: config.collection.symbol,   // Token short prefix, e.g. PUNK
    metaUpdatePermission: 'ItemOwner',
    readOnly: true,
    schema: {
      coverPicture: { 
        urlInfix: config.coverFileName    // Collection cover
      },
      image: {
        // Template for NFTs image search
        urlTemplate: `${config.collection.fileUrl}/{infix}`
      },
      file: {
        urlTemplate: `${config.collection.fileUrl}/{infix}`
      },
      coverPicture: {
        url: `${config.collection.fileUrl}/${config.coverFileName}`
      },
      schemaName: 'unique',
      schemaVersion: '1.0.0',
      attributesSchemaVersion: '1.0.0'
    },
    permissions: {
      nesting: config.collection.nesting,
      mintMode: true
    },
  }

  const attributesSchema = {};
  config.collection.attributes.forEach((attribute, i) => {
    let { name, required, values } = attribute;

    // If attribute defined as a plain string: name = attribute:
    if(typeof attribute === 'string') {
      name = attribute;
    }
    // check if attribute contains `values` field (enumerable property).
    let enumValues;
    if(values) {
      enumValues = {};
      values.forEach((value, j) => {
        enumValues[j.toString()] = { _: value.value ?? value  };
      });
    }

    // basic encoding here:
    attributesSchema[i.toString()] = {
      name: {
        _: name,
      },
      type: 'string',
      optional: !required,
      isArray: false,
    };

    // add enumerable values if defined
    if (enumValues) attributesSchema[i.toString()].enumValues = enumValues;
  });
  collectionInputData.schema.attributesSchema = attributesSchema;
  return collectionInputData;
}

/**
 * Creates a new collection using the provided input data.
 * 
 * @param {Object} collectionInputData - The input data for creating the collection.
 * @returns {Promise<void>} A promise that resolves when the collection is created.
 * @throws Will throw an error if the fileUrl is not set or if there is an error creating the collection.
 */
async function createCollection(collectionInputData) {
  if(!config.collection.fileUrl) {
    throwError('config.js - fileUrl property does not set. Did you forget to save the file?');
  }
  if(config.collection.collectionId) {
    console.log(
      '❗️❗️❗️ you already set a collectionId in "config.js":',
      config.collection.collectionId
    );
    process.exit(1);
  }

  console.log('🚀 Creating collection...');

  const {sdk, account} = await initializeSdk();
  const { parsed: { collectionId }} =
      await sdk.collection.create(
          {
            ...collectionInputData,
            address: account.address
          },
      ).catch(e => {
        if (e.message.includes('Inability to pay some fees')) {
          throwError('account balance low');
        } else {
          throwError(e.message);
        }
      });
  console.log('🚀 Creating collection... done!');
  console.log(`❗️❗️❗️ add to "config.js" collectionId: ${collectionId}`);
}

async function main() {
  config = await getConfig();
  const collectionInputData = encodeAttributes();
  await createCollection(collectionInputData);
}

main().catch(console.error);