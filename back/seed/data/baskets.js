const users = require('./users');

module.exports = users.map((user) => ({ userEmail: user.email }));
