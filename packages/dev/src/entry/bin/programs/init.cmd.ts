import { defaultCommand } from './default.cmd';
import { initService } from '@/entry/service/init.service';
import chalk from 'chalk';

export function initCommand() {

  return defaultCommand('init')
    .description('Init Project')
    .action(async (options) => {

        console.log(chalk.bold('\nInitializing project...\n'));

        await initService(process.env.W13C_WORK_DIR!);
        console.log(chalk.green('✔') + " " + chalk.dim("Directory local-components initialized"));
        console.log(chalk.green('✔') + " " + chalk.dim("Directory web-components   initialized"));
        console.log(chalk.green('✔') + " " + chalk.dim("Directory website          initialized"));
        console.log(chalk.green('✔') + " " + chalk.dim("File w13c.config.json      initialized"));
        console.log(chalk.green('✔') + " " + chalk.dim("File w13c.resolve.json     initialized"));

        console.log();

        console.log(chalk.dim("You can now start the development server with:"));
        console.log(chalk.cyan("  w13c dev"));

        console.log();

        console.log(chalk.dim       ("Add components with:"));
        console.log(chalk.cyan      ("  w13c add <dist-urn> --name <local-name>"));
        console.log(chalk.italic.dim("  or create your own in local-components\n"));


    });

}