import { AtomicStateBuilder } from "@befive/atomic-state";

export default function Schema(){
    return new AtomicStateBuilder()
        .field("aezr", "int32")
        .generate("Config");
}