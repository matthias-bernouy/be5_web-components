import { Administrator } from "./object/Administrator";
import { Instructions } from "./object/Instruction";
import { Myself } from "./object/Myself";
import { Server } from "./object/Server";
import { Shard } from "./object/Shard";
import { System } from "./object/System";

export class Data {

    static shardMemory: SharedArrayBuffer;
    static systemMemory: SharedArrayBuffer;
    static serverMemory: SharedArrayBuffer;
    static mySelfMemory: SharedArrayBuffer;
    static administratorMemory: SharedArrayBuffer;
    static instructionMemory: SharedArrayBuffer;

    static init(){
        const shardMemory = Shard.initMemory(65536);
        Shard.init(shardMemory);

        const systemMemory = System.initMemory(1);
        System.init(systemMemory);

        const serverMemory = Server.initMemory(256);
        Server.init(serverMemory);

        const mySelfMemory = Myself.initMemory(1);
        Myself.init(mySelfMemory);

        const administratorMemory = Administrator.initMemory(16);
        Administrator.init(administratorMemory);

        const instructionMemory = Instructions.initMemory(2048);
        Instructions.init(instructionMemory);

        Data.shardMemory = shardMemory;
        Data.systemMemory = systemMemory;
        Data.serverMemory = serverMemory;
        Data.mySelfMemory = mySelfMemory;
        Data.administratorMemory = administratorMemory;
        Data.instructionMemory = instructionMemory;
    }

}