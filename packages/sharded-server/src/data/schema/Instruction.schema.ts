import { AtomicStateBuilder } from "@befive/atomic-state";

export default function Schema(){

    /**
     * 
     * The message contain a JSON object with the following structure:
     * 
     * - content: object {
     *  - an action
     *  - parameters depending on the action
     * 
     *  - sender: admin:id
     *  - senderSignature: signature
     *  - nonce: uint64
     *  - timestamp: now()
     *  - execution : epoche#125996
     * }
     * 
     * An instruction can be send by sending a request to the tcp port of any server.
    */
    const Instructions = new AtomicStateBuilder()
        .field("instructionID", "uint32")
        .field("message", "uint8", 65536) // in json format
        .generate("Instructions");

    return Instructions;
}