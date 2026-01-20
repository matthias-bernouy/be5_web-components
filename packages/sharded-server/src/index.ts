import { Data } from "./data/Data";
import { Shard } from "./data/object/Shard";

Data.init();


Shard.find(0).lockDocumentSync();