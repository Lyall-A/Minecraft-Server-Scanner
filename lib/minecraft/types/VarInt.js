const UnsignedByte = require('./UnsignedByte');

class VarInt {
    constructor(packet) {
        this.packet = packet;
    }

    write = (value, offset = this.packet.offset) => this.packet.write(VarInt.create(value), offset);
    read = (offset = 0) => VarInt.read(this.packet.read(offset));

    static create(value) {
        if (value < -2147483648 || value > 2147483647) throw new RangeError('VarInt must be between -2147483648 and 2147483647');
        const unsignedBytes = [];
        let length = 0;

        do {
            let byte = value & 0x7F;
            value >>>= 7;
            if (value !== 0) byte |= 0x80;
            unsignedBytes.push(UnsignedByte.create(byte));
            length++;
        } while (value !== 0);
    
        return Buffer.concat(unsignedBytes);
    }

    static read(buffer, offset = 0) {
        let value = 0;
        let length = 0;
        let byte;
        
        do {
            byte = UnsignedByte.read(buffer, offset++).value;
            value |= (byte & 0x7F) << length * 7;
            length++;
            if (length > 5) throw new RangeError('VarInt exceeds 5 bytes');
        } while (byte & 0x80);

        return { value, length };
    };
}

module.exports = VarInt;