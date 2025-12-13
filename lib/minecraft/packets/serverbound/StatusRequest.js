const Packet = require('../../Packet');

class StatusRequest extends Packet {
    constructor(options = { }) {
        super(StatusRequest.packetId);
    }

    static packetId = 0x00;
    static packetResource = 'status_request';
    static packetName = 'Status Request';
}

module.exports = StatusRequest;