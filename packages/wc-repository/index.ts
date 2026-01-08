import { Config } from "./src/core/Config";
import { startRepositoryServer } from "./src/server";

Config.initialize();

startRepositoryServer();
