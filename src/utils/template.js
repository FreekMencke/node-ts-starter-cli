import { copy } from 'fs-extra';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { fileURLToPath } from 'url';

export const TEMPLATE_FOLDER_URL = new URL('../../templates/', import.meta.url);

export function readTemplate(templatePath) {
  return readFile(new URL(templatePath, TEMPLATE_FOLDER_URL));
}

export function copyTemplate(filePath, destination) {
  return copy(join(fileURLToPath(TEMPLATE_FOLDER_URL), filePath), destination, {
    filter: (src) => !src.endsWith('package.json'),
  });
}
