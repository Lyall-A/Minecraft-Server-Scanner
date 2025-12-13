const { EventEmitter } = require('events');

const Packet = require('./Packet');

class PacketParser extends EventEmitter {
    constructor() {
        super();
    }

    handleData = (data) => {
        if (this.receivingData) {
            const allData = Buffer.concat([this.packetData, data]);
            this.packetData = allData.subarray(0, this.expectedLength);
            
            if (this.packetData.length === this.expectedLength) {
                this.finishPacket();

                const remainingData = allData.subarray(this.expectedLength);
                if (remainingData.length) this.startPacket(remainingData);
            }

        } else this.startPacket(data);
    }
    
    startPacket(data) {
        if (this.receivingData) throw new Error('Already receiving packet data!');        
        this.packetLength = Packet.VarInt.read(data);
        this.packetId = Packet.VarInt.read(data, this.packetLength.length);
        this.packetData = data;
        this.expectedLength = this.packetLength.length + this.packetLength.value;
        this.receivingData = true;
    }

    finishPacket() {
        if (!this.receivingData) throw new Error('Not receiving packet data!');
        if (this.packetData.length !== this.expectedLength) throw new Error('Packet not finished!');
        this.receivingData = false;

        const packet = Packet.from(this.packetData);
        this.emit('packet', packet);
        this.emit(`id:${packet.packetId}`, packet);
    }
}

module.exports = PacketParser;