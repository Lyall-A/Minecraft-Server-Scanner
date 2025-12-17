const crypto = require('crypto');
const { Client } = require('../lib/minecraft');

// const publicKey = crypto.createPublicKey({
//     key: require('fs').readFileSync('./test.der'),
//     format: "der",
//     type: "spki",
// });

return;

// const client = new Client('mc.hypixel.net', 25565);
const client = new Client('192.168.1.1', 25565);
// const client = new Client('localhost', 25565);

// client.getStatus().then(console.log);
client.login().then(console.log);