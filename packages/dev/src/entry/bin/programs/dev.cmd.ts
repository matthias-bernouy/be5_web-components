import { Command } from 'commander';
import { defaultCommand } from './default.cmd';
import { devService } from '@/entry/service/dev.service';
export function devCommand() {

  return defaultCommand('dev')
    .description('Start the development server')
    .action(async (options) => {
        await devService();
    });


}