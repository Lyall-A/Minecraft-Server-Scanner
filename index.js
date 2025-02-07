const fs = require("fs");

const ip = require("./ip");
const Minecraft = require("./minecraft/Minecraft");

const config = require("./config.json");
const ipRanges = fs.readFileSync(config.ipRangesLocation, "utf-8")
    .split("\n")
    .map(i => i.match(/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}(?:\s*-\s*\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}|\/\d{1,2})?/)?.[0])
    .filter(i => i)
    .map(i => {
        const isIP = i.match(/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/) ? true : false;
        const isIPRange = i.match(/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\s*-\s*\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/) ? true : false;
        const isCIDR = i.match(/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\/\d{1,2}$/) ? true : false;

        if (isIP) {
            return { start: i, end: i };
        } else if (isIPRange) {
            const start = i.match(/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/g)[0];
            const end = i.match(/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/g)[1];
            return { start, end };
        } else if (isCIDR) {
            return ip.cidrToRange(i);
        }
    });

const scanned = [];

setInterval(() => {
    const randomRange = ipRanges[Math.floor(Math.random() * ipRanges.length)];
    const randomIp = ip.randomIpFromRange(randomRange.start, randomRange.end);

    // console.log(`Trying ${randomIp}`);
    getServer(randomIp)
}, 100);

function getServer(address) {
    const [host, port] = address.split(":");
    const server = new Minecraft({ host, port });
    server.connect().then(() => {
        server.handshake();
        server.sendPacket("Status_Request");
        server.connection.on("data", i => console.log(i.toString()));
    }).catch(err => { });
}

console.log(`IP ranges:\n${ipRanges.map(i => `${i.start} - ${i.end}`).join("\n")}\n`)

// const Minecraft = require("./minecraft/Minecraft");

// Minecraft.getStatus("160.251.236.190").then(i => console.log(i))