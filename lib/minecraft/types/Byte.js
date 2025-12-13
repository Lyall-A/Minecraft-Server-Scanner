class Byte {
    constructor(packet) {
        this.packet = packet;
    }

    write = (value, offset = this.packet.offset) => this.packet.write(Byte.create(value), offset);
    read = (offset = 0) => Byte.read(this.packet.read(offset));

    static create(value) {
        if (value < -128 || value > 127) throw new RangeError('Byte must be between -128 and 127');
        const buffer = Buffer.alloc(1);
        buffer.writeInt8(value);
        return buffer;
    }

    static read(buffer, offset = 0) {
        const value = buffer.readInt8(offset);
        return { value, length: 1 };
    }
}

module.exports = Byte;