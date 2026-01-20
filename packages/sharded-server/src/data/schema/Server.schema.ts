import { AtomicStateBuilder } from "@befive/atomic-state";

export default function Schema(){
    return new AtomicStateBuilder()
        .field("name", "string", 256) // Server name
        .field("ip", "string", 15) // Server IP address
        .field("dn", "string", 256) // Domain name
        .field("pubCert", "uint8", 2048) // Server certificate
        .field("nbCores", "uint16") // Number of CPU cores
        .field("totalMemory", "uint32") // Total memory in GB
        .field("storageCapacity", "uint32") // Storage capacity in GB
        .field("status", "uint8") // Server status (e.g., active, inactive, maintenance, draining...)
        .field("nonce", "uint64") // To prevent replay attacks
        .generate("Server");
}