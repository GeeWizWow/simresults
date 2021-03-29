import { readFileSync } from 'fs';
import { join } from 'path';

export const loadJson = (filePath) => {
    const path = join(__dirname, filePath);
    return JSON.parse(readFileSync(path, { encoding: 'utf8' }));
};