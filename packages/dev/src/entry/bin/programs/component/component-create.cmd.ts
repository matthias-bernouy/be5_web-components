import { createComponent } from '@/entry/service/component.service';
import { defaultCommand } from '../default.cmd';

export function componentCreateCommand() {

  return defaultCommand('create')
    .description('Create local component')
    .argument('<name>', 'Component name')
    .action(async (name) => {
        await createComponent(name);
    });

}