const { expose } = require('threads/worker');
const Jimp = require('jimp');

expose(async function generateImage({images, output, num}) {
  const image = await Jimp.read(images[0])
  for (const img of images.slice(1)) {
    image.composite(await Jimp.read(img), 0, 0);
  }
  image.write(output);
  return num;
});
