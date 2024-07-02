const users = require('./usuariosAutenticados.json');

module.exports = (username, password) => {
    return users.users.find(user => (user.username === username || user.password === password));
}