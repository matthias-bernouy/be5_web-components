import path from "path";
import { startSystem } from "src/core/system";
import { newTerminalMessage } from "src/core/logger/terminalLogger";
import { Data } from "src/data/Data";
import { Administrator } from "src/data/object/Administrator";
import { Myself } from "src/data/object/Myself";
import { Server } from "src/data/object/Server";
import { Shard } from "src/data/object/Shard";
import { System } from "src/data/object/System";

Data.init();

const pathToRootCert   = path.resolve(process.env.ROOT_CERT_PATH   || "./root.crt");
const pathToAdminCert  = path.resolve(process.env.ADMIN_PUB_PATH   || "./admin.pub");
const pathToServerCert = path.resolve(process.env.SERVER_CERT_PATH || "./server.crt");
const pathToServerKey  = path.resolve(process.env.SERVER_KEY_PATH  || "./server.key");

const seed = new Uint8Array(256).map(() => Math.floor(Math.random() * 256));

const system = System.find(0);
const admin = Administrator.find(0);
const server = Server.find(0);
const myself = Myself.find(0);

// Init Administrator
admin.adminID = 0;
admin.pubKey = await Bun.file(pathToAdminCert).arrayBuffer().then(buf => new Uint8Array(buf));
admin.canSendInstructions = 1;
admin.release();

// Init Server
server.name = "server-1";
server.ip = "127.0.0.1";
server.dn = "localhost";
server.pubCert = await Bun.file(pathToServerCert).arrayBuffer().then(buf => new Uint8Array(buf));
server.nbCores = 4;
server.totalMemory = 8 * 1024; // 8 GB
server.storageCapacity = 100 * 1024; // 100 GB
server.status = 1; // Online
server.release();

// Init System
system.nbServers = 1;
system.rootCert = await Bun.file(pathToRootCert).arrayBuffer().then(buf => new Uint8Array(buf));
system.rootNonce = 0;
system.epochDuration = 3600; // 10 minutes
system.seed = seed;
system.release();

// Init Myself
myself.id = 0;
myself.currentEpoch = 0;
myself.privKey = await Bun.file(pathToServerKey).arrayBuffer().then(buf => new Uint8Array(buf));
myself.release();

// Init Shards
for (let i = 0; i < 65536; i++) {
    const shard = Shard.find(i);
    shard.currentWriteHost = 0;
    shard.writeHosts = new Uint8Array([0]);
    shard.writeHostCount = 1;
    shard.release();
}

newTerminalMessage("First initialization completed.");

startSystem();