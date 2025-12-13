class UnsignedByte {
    constructor(packet) {
        this.packet = packet;
    }

    write = (value, offset = this.packet.offset) => this.packet.write(UnsignedByte.create(value), offset);
    read = (offset = 0) => UnsignedByte.read(this.packet.read(offset));

    static create(value) {
        if (value < 0 || value > 255) throw new RangeError('UnsignedByte must be between 0 and 255');
        const buffer = Buffer.alloc(1);
        buffer.writeUint8(value);
        return buffer;
    }

    static read(buffer, offset = 0) {
        const value = buffer.readUint8(offset);
        return { value, length: 1 };
    }
}

module.exports = UnsignedByte;