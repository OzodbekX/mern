const devices = require('./devices');

module.exports = devices.flatMap((device, index) => [
    {
        deviceName: device.name,
        title: 'Warranty',
        description: `${1 + (index % 3)} year${index % 3 === 0 ? '' : 's'}`
    },
    {
        deviceName: device.name,
        title: 'Color',
        description: ['Black', 'White', 'Silver', 'Blue'][index % 4]
    }
]);
