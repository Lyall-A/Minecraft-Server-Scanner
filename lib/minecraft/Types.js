const Byte = require('./types/Byte');
const Long = require('./types/Long');
const String = require('./types/String');
const UnsignedByte = require('./types/UnsignedByte');
const UnsignedShort = require('./types/UnsignedShort');
const VarInt = require('./types/VarInt');

class Types {
    constructor(packet) {
        if (packet) this.initTypes(packet);
    }
    
    initTypes(packet) {
        const byte = new Types.Byte(packet);
        const long = new Types.Long(packet);
        const string = new Types.String(packet);
        const unsignedByte = new Types.UnsignedByte(packet);
        const unsignedShort = new Types.UnsignedShort(packet);
        const varInt = new Types.VarInt(packet);
    
        this.writeByte = byte.write;
        this.readByte = byte.read;

        this.writeLong = long.write;
        this.readLong = long.read;

        this.writeString = string.write;
        this.readString = string.read;

        this.writeUnsignedByte = unsignedByte.write;
        this.readUnsignedByte = unsignedByte.read;

        this.writeUnsignedShort = unsignedShort.write;
        this.readUnsignedShort = unsignedShort.read;

        this.writeVarInt = varInt.write;
        this.readVarInt = varInt.read;
    }

    static Byte = Byte;
    static Long = Long;
    static String = String;
    static UnsignedByte = UnsignedByte;
    static UnsignedShort = UnsignedShort;
    static VarInt = VarInt;
}

module.exports = Types;