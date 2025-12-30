import { defaultCommand } from '../default.cmd';

export function componentPublishCommand() {

  return defaultCommand('publish')
      .description('Publish component to the registry')
      .argument('<name>', 'Component name')
      .action((name) => {
      });

}