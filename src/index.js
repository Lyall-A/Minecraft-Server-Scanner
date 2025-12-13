const { Client } = require('../lib/minecraft');

const host = 'mc.hypixel.net';
const port = 25565;

const client = new Client(host, port);
console.log('Connecting');
client.connect();
client.on('connected', () => {
    client.getStatus().then(console.log);
});