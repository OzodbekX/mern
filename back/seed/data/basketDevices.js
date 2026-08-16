const devices = require('./devices');
const users = require('./users');

// Put five deterministic products in every user's basket.
module.exports = users.flatMap((user, userIndex) =>
    Array.from({ length: 5 }, (_, index) => ({
        userEmail: user.email,
        deviceName: devices[userIndex * 5 + index].name
    }))
);
