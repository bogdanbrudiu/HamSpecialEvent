import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientAppDir = path.resolve(__dirname, '..');
const projectDir = path.resolve(clientAppDir, '..');
const publishDir = path.join(projectDir, 'bin', 'E2E', 'publish');
const projectFile = path.join(projectDir, 'HamEvent.csproj');
const baseUrl = process.env.BASE_URL ?? 'http://127.0.0.1:5050';

function run(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: clientAppDir,
      stdio: 'inherit',
      shell: false,
      ...options,
    });

    child.on('exit', (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(`${command} ${args.join(' ')} failed with exit code ${code ?? -1}`));
    });

    child.on('error', reject);
  });
}

async function main() {
  await run('dotnet', [
    'publish',
    projectFile,
    '--configuration',
    'Release',
    '--framework',
    'net9.0',
    '--output',
    publishDir,
    '--runtime',
    'win-x64',
    '--self-contained',
    'true',
    '-p:PublishTrimmed=false',
    '-p:PublishSingleFile=false',
  ]);

  const executableName = process.platform === 'win32' ? 'HamEvent.exe' : 'HamEvent';
  const executablePath = path.join(publishDir, executableName);

  if (!existsSync(executablePath)) {
    throw new Error(`Published executable not found at ${executablePath}`);
  }

  const server = spawn(executablePath, {
    cwd: publishDir,
    stdio: 'inherit',
    env: {
      ...process.env,
      ASPNETCORE_ENVIRONMENT: 'Production',
      ASPNETCORE_URLS: baseUrl,
    },
  });

  const stopServer = () => {
    if (!server.killed) {
      server.kill('SIGTERM');
    }
  };

  process.on('SIGINT', stopServer);
  process.on('SIGTERM', stopServer);
  process.on('exit', stopServer);

  server.on('exit', (code) => {
    process.exit(code ?? 0);
  });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});