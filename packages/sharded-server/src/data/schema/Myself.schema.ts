import { AtomicStateBuilder } from "@befive/atomic-state";

export default function Schema() {

    const Myself = new AtomicStateBuilder()
        .field("id", "uint8")
        .field("currentEpoch", "uint32") // timestamp / System.epochDuration
        .field("privKey", "uint8", 4096)
        .generate("Myself");
    return Myself;
}