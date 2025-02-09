function cidrToRange(cidr) {
    const [ip, mask] = cidr.split("/");
    const maskInt = parseInt(mask, 10);

    const ipInt = ipToInt(ip);

    const numHosts = Math.pow(2, 32 - maskInt);

    const startIpInt = ipInt & ((-1) << (32 - maskInt));

    const endIpInt = startIpInt + numHosts - 1;

    return { start: intToIp(startIpInt), end: intToIp(endIpInt) };
}

function ipToInt(ip) {
    const parts = ip.split(".").map(Number);
    return (parts[0] << 24) | (parts[1] << 16) | (parts[2] << 8) | parts[3];
}

function intToIp(int) {
    return [
        (int >>> 24) & 255,
        (int >>> 16) & 255,
        (int >>> 8) & 255,
        int & 255
    ].join(".");
}

function randomIpFromRange(start, end) {
    const startInt = ipToInt(start);
    const endInt = ipToInt(end);

    const randomInt = Math.floor(Math.random() * (endInt - startInt + 1)) + startInt;

    return intToIp(randomInt);
}

function expandIpRange(start, end) {
    const startInt = ipToInt(start);
    const endInt = ipToInt(end);

    const ips = [];
    for (let i = startInt; i <= endInt; i++) {
        ips.push(intToIp(i));
    }

    return ips;
}

module.exports = {
    cidrToRange,
    intToIp,
    randomIpFromRange,
    expandIpRange
};