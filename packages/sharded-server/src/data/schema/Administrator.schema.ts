import { AtomicStateBuilder } from "@befive/atomic-state";

export default function Schema(){

    const Administrator = new AtomicStateBuilder()
        .field("adminID", "uint8")
        .field("pubKey", "uint8", 2048)
        .field("canSendInstructions", "uint8")
        .field("nonce", "uint64") // To prevent replay attacks
        .generate("Administrator");

    return Administrator;
}