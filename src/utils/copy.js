import { copy } from 'fs-extra';
import { join } from 'path';

export function copyTemplate(templateFolder, filePath, destination) {
  return copy(join(templateFolder, filePath), destination, {
    filter: (src) => !src.endsWith('package.json'),
  });
}
