const devices = require('./devices');
const users = require('./users').filter((user) => user.role === 'USER');

// Each user rates 20 devices, producing 100 rating records.
module.exports = users.flatMap((user, userIndex) =>
    Array.from({ length: 20 }, (_, index) => ({
        userEmail: user.email,
        deviceName: devices[userIndex * 20 + index].name,
        rate: 1 + ((userIndex + index) % 5)
    }))
);
