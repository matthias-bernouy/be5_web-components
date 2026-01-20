import { AtomicStateBuilder } from "@befive/atomic-state";

// export default function Schema(){
//     return new AtomicStateBuilder()
//         .field("ressourceID", "uint8") // Server hosting this shard
//         .field("type", "string", 256) // ServerID responsible for managing this shard
//         .field("replicas", "uint8", 8) // List of serverIDs hosting replicas
//         .field("replicaCount", "uint8") // Number of replicas for this shard
//         .field("readOnlyReplicas", "uint8", 8) // List of serverIDs hosting read-only replicas
//         .field("readOnlyReplicaCount", "uint8") // Number of read-only replicas for this shard
//         .generate("Shard");
// }