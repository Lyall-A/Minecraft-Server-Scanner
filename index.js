const fs = require("fs");

const ip = require("./ip");
const Minecraft = require("./minecraft/Minecraft");
const filter = require("./filter");

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

const ips = [];
for (const { start, end } of ipRanges) ips.push(...ip.expandIpRange(start, end));

// const scanned = fs.existsSync(config.scannedIpsLocation) ? fs.readFileSync(config.scannedIpsLocation, "utf-8").split("\n").map(i => i.match(/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/)?.[0]).filter(i => i) : [];
const scanned = fs.existsSync(config.ipsLocation) ? fs.readFileSync(config.ipsLocation, "utf-8").split("\n").map(i => i.match(/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/)?.[0]).filter(i => i) : [];
// const scanned = [];

console.log(`IP ranges:\n${ipRanges.map(i => `${i.start} - ${i.end}`).join("\n")}\n`);
console.log(`${ips.length} possible IP's`);

for (let thread = 0; thread < config.threads; thread++) {
    let iteration = 0;
    (async function scan() {
        // Random
        // const randomRange = ipRanges[Math.floor(Math.random() * ipRanges.length)];
        // const ip = ip.randomIpFromRange(randomRange.start, randomRange.end);

        // Incremental
        const ipIndex = thread + (iteration * config.threads);
        if ((ipIndex + 1) >= ips.length) return;
        const ip = ips[ipIndex];
        iteration++;

        if (scanned.includes(ip)) {
            // console.log(`Already scanned ${ip} ${ipIndex}`);
            return scan();
        }

        scanned.push(ip);
        // fs.appendFileSync(config.scannedIpsLocation, `${ip}\n`);
        
        // console.log(`Scanning ${ip} on thread ${thread}, iteration ${iteration}...`);

        await getServer(ip).then(i => {
            // if (!filter(i)) return;
            const filtered = !filter(i);
            fs.appendFileSync(config.ipsLocation, `${ip}\n`);
            console.log(`${filtered ? "FILTERED: " : ""}IP: ${ip}, description: ${(i.description.text || i.description).replace(/\n/g, "")}, players: ${i.players.online} of ${i.players.max}, version: ${i.version.name}, modded: ${i.forgeData ? "forge" : "no"}, thread: ${thread + 1}, iteration: ${iteration}`);
        }).catch(err => {
            // console.log(`${ip} nope`);
        });

        scan();
    })();
}

function getServer(address) {
    return new Promise((resolve, reject) => {
        const [host, port] = address.split(":");
        const server = new Minecraft({ host, port, timeout: config.timeout });
        server.connect().then(() => {
            server.handshake();
            server.sendPacket("Status_Request");
            server.on("packet", packet => {
                // try {
                const status = JSON.parse(Minecraft.types.readString(packet.data).value);
                resolve(status);
                // } catch (err) {
                //     // console.log(`Failed to parse:`, Minecraft.types.readString(packet.data).value)
                //     reject(err);
                // }
            });
        }).catch(err => reject(err));
    });
}

// const Minecraft = require("./minecraft/Minecraft");

// Minecraft.getStatus("160.251.236.190").then(i => console.log(i))