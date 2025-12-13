const clientbound = {

};
const serverbound = {
    Handshake: require('./packets/serverbound/Handshake'),
    StatusRequest: require('./packets/serverbound/StatusRequest'),
    PingRequest: require('./packets/serverbound/PingRequest')
};

class Packets {
    static createServerbound = (packetName, options) => Packets.create('serverbound', packetName, options);
    static createClientbound = (packetName, options) => Packets.create('clientbound', packetName, options);

    static create(bound, packetName, options) {
        const packets = Packets[['serverbound', 'clientbound'].find(i => i === bound.toLowerCase())];
        if (!packets) throw new Error('"bound" must be either serverbound or clientbound!');
        const Packet = Object.values(packets).find(Packet => [Packet.packetResource, Packet.packetName, Packet.name].map(name => name.toLowerCase()).includes(packetName.toLowerCase()));
        if (!Packet) throw new Error(`Packet "${packetName}" doesn't exist!`);
        return new Packet(options);
    }

    static clientbound = clientbound;
    static serverbound = serverbound;
}

module.exports = Packets;