const express = require('express');
const { z } = require('zod');
const { Client } = require('../../../lib/minecraft');

const { db } = require('../../globals');

const router = express.Router();

const scanSchema = z.object({
    host: z.string(),
    port: z.number().min(0).max(65535).default(25565),
    protocolVersion: z.number().default(773)
});

router.post('/', async (req, res) => {
    console.log(req.body)
    const { data: body, success: bodySuccess, error: bodyError } = scanSchema.safeParse(req.body);

    if (!bodySuccess) return res.status(400).json(bodyError.issues);

    const client = new Client(body.host, body.port, {
        protocolVersion: body.protocolVersion
    });
    
    const status = await client.getStatus();

    const scanResult = {
        host: client.host,
        ipAddress: client.ipAddress || client.host,
        port: client.port,
        name: body.name,
        description: status.description,
        versionName: status.version.name,
        protocolVersion: status.version.protocol,
        favicon: status.favicon,
        maxPlayers: status.players.max,
        playerCount: status.players.online
    };

    db.prepare(`
        INSERT INTO scans (
            host,
            ip_address,
            port,
            name,
            description,
            version_name,
            protocol_version,
            favicon,
            max_players,
            player_count
        ) VALUES (
            @host,
            @ipAddress,
            @port,
            @name,
            @description,
            @versionName,
            @protocolVersion,
            @favicon,
            @maxPlayers,
            @playerCount
        )
    `).run(scanResult);

    res.json(scanResult);
});

module.exports = router;