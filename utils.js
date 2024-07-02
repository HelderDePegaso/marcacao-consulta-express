const { v4: uuidv4 } = require('uuid');

class ErrorROBJ extends Error {
    constructor(message, data) {
        super(message);
        this.data = data;
    }
}


module.exports = {
    ErrorROBJ
}