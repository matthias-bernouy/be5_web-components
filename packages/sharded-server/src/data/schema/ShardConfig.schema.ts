import { AtomicStateBuilder } from "@befive/atomic-state";

export default function Schema(){
    return new AtomicStateBuilder()
        .field("serverID", "int8")
        .generate("ShardConfig");
}