const {readAttributesCsv} = require('./read-csv');
const config = require('../config');
const throwError = require('./errors');
const fs = require('fs');

async function formatAttributes() {
  try {
    const attributes = await readAttributesCsv();
    const jsonAttributes = [];
    console.log('👨‍🔬 Testing attributes...');
    for (const attr of attributes) {
      const attributeObj = format(attr);
      testAttribute(attributeObj);
      jsonAttributes.push(attributeObj);
    }
    console.log('👨‍🔬 Testing attributes... done!');
    fs.writeFileSync('./attributes.json', JSON.stringify(jsonAttributes));
    console.log('💾 Attributes saved in "attributes.json"');
    return jsonAttributes;
  } catch (e) {
    throwError('cannot format attributes');
  }
}

function format(attribute) {
  const obj = {};
  obj.name = attribute[0];
  obj.chance = attribute[1];
  obj.required = attribute[1] === 100;
  obj.values = attribute
    .slice(2)
    .map(v => {
      const [value, weight] = v.split(config.weightSeparator);
      return {value, weight: weight ?? 1}
    })
    .filter(v => v.value !== '');
  return obj;
}

function testAttribute(attribute) {
  if (!attribute.name)
    throwError('attribute should have name');
  if (typeof attribute.required === 'undefined')
    throwError(`attribute should have required value: ${attribute.name}`);
  if (attribute.chance > 100 || attribute.chance < 0)
    throwError(`attribute should be between 0 and 100: ${attribute.name}`);
  
  const totalWeight = attribute.values.reduce((acc, curr) => {
    if (+curr.weight === 0) throwError(`weight 0: ${attribute.name}`)
    return acc + +curr.weight
  }, 0);

  if (totalWeight > 100) throwError(`total weight cannot be gt 100: ${attribute.name}`)

  if (totalWeight !== attribute.chance) {
    if (attribute.chance !== 100) {
      throwError(`if chance < 100 than it should be equal total values weight: ${attribute.name}`);
    }
  }
}

module.exports = formatAttributes;
