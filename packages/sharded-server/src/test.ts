import { System } from "./data/object/System";

const memSystem = System.initMemory(1);
System.init(memSystem);

const loadedSystem = System.find(0);

loadedSystem.CONTROLLER_ID_NETWORK = 1;
loadedSystem.CONTROLLER_ID_SHARD = 2;
loadedSystem.CONTROLLER_ID_REPLICA = 3;

const decoder = new TextDecoder(); // Par défaut en 'utf-8'
const encoder = new TextEncoder();

encoder.encode("Hello World");
loadedSystem.CA_BUNDLE.set(encoder.encode("Hello World"));

const indexOfZero = loadedSystem.CA_BUNDLE.indexOf(0);
console.log(indexOfZero)
const res = decoder.decode(indexOfZero === -1 ? loadedSystem.CA_BUNDLE : loadedSystem.CA_BUNDLE.subarray(0, indexOfZero));
console.log("CA_BUNDLE content:", res);

loadedSystem.MYSELF_NAME = "Server_01";
console.log("MYSELF_NAME:", loadedSystem.MYSELF_NAME);