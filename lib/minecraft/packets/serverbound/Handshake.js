const Packet = require('../../Packet');

class Handshake extends Packet {
    constructor(options = { }) {
        super(Handshake.packetId);

        this.writeVarInt(options.protocolVersion);
        this.writeString(options.serverAddress);
        this.writeUnsignedShort(options.serverPort);
        this.writeVarInt(Handshake.Intent[options.intent]);
    }

    static packetId = 0x00;
    static packetResource = 'intention';
    static packetName = 'Handshake';

    static Intent = {
        STATUS: 1,
        LOGIN: 2,
        TRANSFER: 3
    };
}

module.exports = Handshake;