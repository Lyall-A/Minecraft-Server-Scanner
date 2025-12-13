const VarInt = require('./VarInt');

class String {
    constructor(packet) {
        this.packet = packet;
    }

    write = (value, offset = this.packet.offset) => this.packet.write(String.create(value), offset);
    read = (offset = 0) => String.read(this.packet.read(offset));

    static create(value) {
        const string = Buffer.from(value, 'utf8');
        const varInt = VarInt.create(string.length);
        return Buffer.concat([varInt, string]);
    }

    static read(buffer, offset = 0) {
        const { value: stringLength, length: varIntLength } = VarInt.read(buffer, offset);
        offset += varIntLength;
        const value = buffer.subarray(offset, offset + stringLength).toString();
        return { value, length: varIntLength + stringLength };
    }
}

module.exports = String;