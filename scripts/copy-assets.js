import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const srcDir = path.join(__dirname, '../src/electron/assets');
const destDir = path.join(__dirname, '../dist-electron/assets');

if (!fs.existsSync(srcDir)) {
    console.warn(`Source directory ${srcDir} does not exist. Skipping asset copy.`);
    process.exit(0);
}

if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
}

fs.readdirSync(srcDir).forEach(file => {
    const srcFile = path.join(srcDir, file);
    const destFile = path.join(destDir, file);
    fs.copyFileSync(srcFile, destFile);
    console.log(`Copied ${file} to ${destDir}`);
});
