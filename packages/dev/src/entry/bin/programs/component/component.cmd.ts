import { Command } from 'commander';
import { componentAddCommand } from './component-import.cmd';
import { componentPublishCommand } from './component-publish.cmd';

export function componentCommand() {

  return new Command('component')
    .description('Manage web components')
    .addCommand(componentAddCommand())
    .addCommand(componentPublishCommand())

}