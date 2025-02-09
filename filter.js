function filter(server) {
    if (server.forgeData) return false;
    if (!server.players.online) return false;
    return true;
}

module.exports = filter;