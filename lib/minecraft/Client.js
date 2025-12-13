const net = require('net');
const { EventEmitter } = require('events');

const Packet = require('./Packet');
const Packets = require('./Packets');
const PacketParser = require('./PacketParser');

class Client extends EventEmitter {
    constructor(host, port = 25565) {
        super();

        this.protocolVersion = 773;
        this.host = host;
        this.port = port;
    }

    send(packet) {
        this.connection.write(packet instanceof Packet ? packet.toBuffer() : packet);
    }

    getStatus() {
        return new Promise((resolve, reject) => {
            this.send(Packets.createServerbound('intention', {
                protocolVersion: this.protocolVersion,
                serverAddress: this.host,
                serverPort: this.port,
                intent: 'STATUS'
            }));
            this.send(Packets.createServerbound('status_request'));
            this.send(Packets.createServerbound('ping_request'));

            this.packetParser.once(`id:0`, packet => resolve(JSON.parse(packet.readString().value)));
        });
    }

    connect() {
        return new Promise((resolve, reject) => {
            this.connection = net.createConnection({
                host: this.host,
                port: this.port
            }, () => {
                this.packetParser = new PacketParser();
                this.packetParser.on('packet', packet => this.emit('packet', packet));
                this.connection.on('data', this.packetParser.handleData);

                resolve();
                this.emit('connected');
            });
        });
    }
}

module.exports = Client;