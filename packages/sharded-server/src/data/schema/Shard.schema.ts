import { AtomicStateBuilder } from "@befive/atomic-state";

export default function Schema(){
    return new AtomicStateBuilder()
        .field("currentWriteHost", "uint8") // Current writer host for this shard
        .field("writeHosts", "uint8", 8) // Number of write hosts for this shard
        .field("writeHostCount", "uint8") // Number of write hosts for this shard
        //.field("readHosts", "uint8", 8) // Number of read hosts for this shard
        //.field("readHostCount", "uint8") // Number of read hosts for this shard
        .generate("Shard");
}