const brands = require('./brands');
const types = require('./types');

// Every brand is associated with every product type.
module.exports = types.flatMap((type) =>
    brands.map((brand) => ({ type: type.name, brand: brand.name }))
);
