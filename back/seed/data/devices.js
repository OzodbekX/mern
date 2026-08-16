const brands = require('./brands');
const types = require('./types');

const images = [
    'ea893f66-352d-4e4e-9d1f-aaa9afbbe696.jpg',
    'e6420c70-9798-42c0-9cd6-864c1eea9c12.jpg',
    '94648d0d-b4b4-4dc6-b5bd-62dcad916e08.jpg',
    '136acb0f-03f7-46cd-8b32-6d0995fc1fdc.jpg'
];

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
