const Types = require('./Types');

class Packet extends Types {
    constructor(packetId) {
        super();
        
        this.packetId = packetId;

        this.offset = 0;
        this.chunks = [];

        this.initTypes(this);
    }
    
    write(buffer, offset = this.offset) {
        // TODO: i dont like this at all
        const existingChunkIndex = this.chunks.findIndex(chunk => chunk.offset === offset);

        const chunk = {
            buffer,
            offset,
            length: buffer.length
        }

        if (existingChunkIndex >= 0) {
            this.chunks[existingChunkIndex] = chunk;
        } else if (this.getLength() >= offset + chunk.length) {
            throw new Error('collision'); // TODO
        } else {
            this.chunks.push(chunk);
        }

        this.offset = this.getLength();
        return chunk.length;
    }

    read(offset) {
        const chunk = this.chunks.find(chunk => offset === chunk.offset);
        return chunk.buffer;
    }

    getLength() {
        return this.chunks.length > 0 ? Math.max(...this.chunks.map(chunk => chunk.offset + chunk.length)) : 0;
    }

    toBuffer() {
        const length = this.getLength();

        const packetIdBuffer = Types.VarInt.create(this.packetId);
        const lengthBuffer = Types.VarInt.create(packetIdBuffer.length + length);
        const dataBuffer = Buffer.alloc(length);

        for (const chunk of this.chunks) {
            dataBuffer.set(chunk.buffer, chunk.offset);
        }

        return Buffer.concat([lengthBuffer, packetIdBuffer, dataBuffer]);
    }

    static from(buffer) {
        let offset = 0;
        const packetLength = Packet.VarInt.read(buffer);
        offset += packetLength.length;
        const packetId = Packet.VarInt.read(buffer, offset);
        offset += packetId.length;
        const packetData = buffer.subarray(offset);

        const packet = new Packet(packetId.value);
        packet.write(packetData);
        return packet;
    }
}

module.exports = Packet;