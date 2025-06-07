// backend/start.js
// This script manually loads .env variables and then runs server.js

import { readFileSync } from 'fs';
import { resolve } from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = resolve(__filename, '..'); // Points to the backend directory

const envPath = resolve(__dirname, '.env'); // Path to your .env file

try {
  const envContent = readFileSync(envPath, 'utf8');
  const lines = envContent.split('\n');

  for (const line of lines) {
    const trimmedLine = line.trim();
    if (trimmedLine && !trimmedLine.startsWith('#')) { // Ignore empty lines and comments
      const [key, ...valueParts] = trimmedLine.split('=');
      const value = valueParts.join('=').replace(/^"|"$/g, ''); // Remove quotes if present
      if (key) {
        process.env[key.trim()] = value.trim();
        console.log(`Loaded env var: ${key.trim()}=${value.trim().substring(0, 10)}...`); // Log safely
      }
    }
  }
  console.log(".env variables manually loaded.");
} catch (error) {
  console.error("Error loading .env file manually:", error);
  console.error("Please ensure .env file exists at:", envPath);
  process.exit(1);
}

// Now, spawn the actual server.js process
console.log("Starting server.js...");
const serverProcess = spawn('node', ['server.js'], {
  stdio: 'inherit', // Pipe child process stdout/stderr to parent
  cwd: __dirname // Ensure child process runs in the backend directory
});

serverProcess.on('error', (err) => {
  console.error('Failed to start server.js process:', err);
});

serverProcess.on('exit', (code) => {
  if (code !== 0) {
    console.error(`server.js process exited with code ${code}`);
  }
});
