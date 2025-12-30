import { Command } from 'commander';
import { defaultCommand } from '../default.cmd';

export function componentAddCommand() {

  return defaultCommand('add')
    .description('Add component from the registry')
    .argument('<name>', 'Component name')
    .option('-n, --name <type>', 'Resolution name')
    .action(async (name, options) => {
    });

}