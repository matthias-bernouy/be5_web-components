import { join } from "path";
import { Data } from "src/data/Data";


/**
 * 
 * @param type 
 * @param id 
 */
export function createAndPersistWorker(type: "system" | "app", id: number){

    let worker = new Worker(join(import.meta.dir + `${type}.worker.ts`));

    worker.postMessage({
        idWorker: id,
        systemMemory: Data.systemMemory,
        shardMemory: Data.shardMemory,
        serverMemory: Data.serverMemory,
        myselfMemory: Data.mySelfMemory,
        administratorMemory: Data.administratorMemory,
        instructionMemory: Data.instructionMemory
    })

    worker.onerror = (error) => {
        worker.terminate();
        createAndPersistWorker(type, id);
    };

}