import { Command } from 'commander';
import path from 'node:path';

export function defaultCommand(name: string) {
  const cmd = new Command(name)
    .option('-c --config <config>', 'Chemin vers le fichier de configuration')
    .option('-w --workdir <workdir>', 'Chemin vers le répertoire de travail')
    .exitOverride();



  cmd.hook('preAction', async (thisCommand, actionCommand) => {
    const options = actionCommand.opts();

    if (options.workdir) {
      process.env.W13C_WORK_DIR = path.join(process.cwd(), options.workdir);
    } else {
      process.env.W13C_WORK_DIR = process.cwd();
    }

    if (options.config) {
      process.env.W13C_CONFIG_PATH = options.config;
    } else {
      process.env.W13C_CONFIG_PATH = "w13c.config.json";
    }

    process.env.W13C_REPOSITORY = "https://cdn.web-components.fr";

  });

  return cmd;
}