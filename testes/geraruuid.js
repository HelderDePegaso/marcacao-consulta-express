const { v4: uuidv4 } = require('uuid');

// Gerar um UUID v4
const myUUID = uuidv4();

console.log('Generated UUID:', myUUID);

console.log(myUUID.length)