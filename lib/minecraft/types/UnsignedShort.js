class UnsignedShort {
    constructor(packet) {
        this.packet = packet;
    }

    write = (value, offset = this.packet.offset) => this.packet.write(UnsignedShort.create(value), offset);
    read = (offset = 0) => UnsignedShort.read(this.packet.read(offset));

    static create(value) {
        if (value < 0 || value > 65535) throw new RangeError('UnsignedShort must be between 0 and 65535');
        const buffer = Buffer.alloc(2);
        buffer.writeUint16BE(value);
        return buffer;
    }

    static read(buffer, offset = 0) {
        const value = buffer.readUint16BE(offset);
        return { value, length: 2 };
    }
}

module.exports = UnsignedShort;