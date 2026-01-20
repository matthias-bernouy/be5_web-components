import { AtomicStateBuilder } from "@befive/atomic-state";



export default function Schema(){

    const options = new AtomicStateBuilder()
        .field("orchestration", "string", 32) // root-validated | consensus-driven

    const System = new AtomicStateBuilder()
        .field("rootCert", "uint8", 8192)
        .field("seed", "uint8", 256)
        .field("port", "uint16")
        .field("epochDuration", "uint32") // in seconds
        .field("nbServers", "uint8")
        .struct("options", options)
        .generate("System");
    
    return System;
}