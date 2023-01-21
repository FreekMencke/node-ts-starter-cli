import { readFile } from 'fs/promises';

export async function importJSON(path) {
  return JSON.parse(await readFile(path));
}
