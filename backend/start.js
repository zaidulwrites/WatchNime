// backend/start.js

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { resolve } from 'path';
import { existsSync, readFileSync } from 'fs';

// Resolve directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = resolve(__filename, '..');
const envPath = resolve(__dirname, '.env');

// ✅ Load .env ONLY in local development
if (process.env.NODE_ENV !== 'production' && existsSync(envPath)) {
  const envContent = readFileSync(envPath, 'utf8');
  const lines = envContent.split('\n');

  for (const line of lines) {
    const trimmedLine = line.trim();
    if (trimmedLine && !trimmedLine.startsWith('#')) {
      const [key, ...valueParts] = trimmedLine.split('=');
      const value = valueParts.join('=').replace(/^"|"$/g, '');
      if (key) {
        process.env[key.trim()] = value.trim();
        console.log(`Loaded env var: ${key.trim()}=${value.trim().substring(0, 10)}...`);
      }
    }
  }

  console.log(".env variables manually loaded from file.");
} else {
  console.log("Skipping .env manual load (Render or production environment).");
}

// Start the main server
console.log("Starting server.js...");
const serverProcess = spawn('node', ['server.js'], {
  stdio: 'inherit',
  cwd: __dirname,
});

serverProcess.on('error', (err) => {
  console.error('Failed to start server.js process:', err);
});

serverProcess.on('exit', (code) => {
  if (code !== 0) {
    console.error(`server.js process exited with code ${code}`);
  }
});
