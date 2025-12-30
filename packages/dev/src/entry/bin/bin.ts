import { Command, type ParseOptions } from "commander"
import { devCommand } from "./programs/dev.cmd";
import { initCommand } from "./programs/init.cmd";
import { componentCommand } from "./programs/component/component.cmd";

const program = new Command();

program.addCommand(initCommand());
program.addCommand(componentCommand());
program.addCommand(devCommand());

( async () => {
  try {
    await program.parseAsync(process.argv);
  } catch (err: any) {
    console.error(`\x1b[31m%s\x1b[0m`, `Error: ${err.message}`);
    process.exit(err.exitCode || 1);
  }
})();