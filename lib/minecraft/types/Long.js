class Long {
    constructor(packet) {
        this.packet = packet;
    }

    write = (value, offset = this.packet.offset) => this.packet.write(Long.create(value), offset);
    read = (offset = 0) => Long.read(this.packet.read(offset));

    static create(value) {
        if (value < -9223372036854775808n || value > 9223372036854775807n) throw new RangeError('Long must be between -9223372036854775808 and 9223372036854775807n');
        const buffer = Buffer.alloc(8);
        buffer.writeBigInt64BE(BigInt(value));
        return buffer;
    }

    static read(buffer, offset = 0) {
        const value = buffer.readBigInt64BE(offset);
        return { value, length: 8 };
    }
}

module.exports = Long;