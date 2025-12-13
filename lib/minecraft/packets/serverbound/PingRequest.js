const Packet = require('../../Packet');

class PingRequest extends Packet {
    constructor(options = { }) {
        super(PingRequest.packetId);

        this.writeLong(options.timestamp ?? Date.now());
    }

    static packetId = 0x01;
    static packetResource = 'ping_request';
    static packetName = 'Ping Request';
}

module.exports = PingRequest;