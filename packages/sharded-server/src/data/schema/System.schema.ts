import { AtomicStateBuilder } from "@befive/atomic-state";



export default function Schema(){

    const Controller = new AtomicStateBuilder()
        .field("NETWORK", "uint8") // Delete and add server to the network
        .field("SHARD", "uint8") // Assign the shard responsability to a server
        .field("REPLICA", "uint8") // Assign to a server the responsability to host replica of a shard

    const Myself = new AtomicStateBuilder()
        .field("ID", "uint8")
        .field("NAME", "string", 16)
        .field("IP", "string", 16)
        .field("DOMAIN", "string", 128)

    const Shard = new AtomicStateBuilder()
        .field("ID", "uint8")
        .field("replicas", "uint8", 8)
        .field("REPLICA_COUNT", "uint8")

    const System = new AtomicStateBuilder()
        .field("CA_BUNDLE", "uint8", 4096)
        .struct("shards", Shard)
        .struct("CONTROLLER_ID", Controller)
        .struct("MYSELF", Myself)
        .generate("System");
    
    return System;
}