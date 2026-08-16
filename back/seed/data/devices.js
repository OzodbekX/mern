const fs = require('fs');
const path = require('path');
const brands = require('./brands');
const types = require('./types');

const staticDirectory = path.resolve(__dirname, '../../static');
const images = fs.readdirSync(staticDirectory)
    .filter((fileName) => /\.(jpe?g|png|webp|gif)$/i.test(fileName))
    .sort();

if (images.length === 0) {
    throw new Error(`No seed images found in ${staticDirectory}`);
}

// Twenty products for each of the ten types gives exactly 200 devices.
module.exports = Array.from({ length: 200 }, (_, index) => {
    const type = types[index % types.length].name;
    const brand = brands[(index * 3 + Math.floor(index / types.length)) % brands.length].name;
    const modelNumber = String(index + 1).padStart(3, '0');

    return {
        name: `${brand} ${type} Model ${modelNumber}`,
        price: 49 + ((index * 37) % 1950),
        rating: index % 6,
        img: images[index % images.length],
        brand,
        type
    };
});
