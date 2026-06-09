// Run migrations programmatically for ESM projects
import { sequelize } from '../config/database.js';
import { readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const migrationsDir = join(__dirname, '..', 'migrations');
const seedersDir = join(__dirname, '..', 'seeders');

async function runMigrations() {
  console.log('Running migrations...');
  const files = readdirSync(migrationsDir).sort();
  for (const file of files) {
    if (!file.endsWith('.js')) continue;
    const migration = await import(join(migrationsDir, file));
    console.log(`  -> ${file}`);
    await migration.up(sequelize.getQueryInterface(), sequelize.Sequelize);
  }
  console.log('Migrations done.');
}

async function runSeeders() {
  console.log('Running seeders...');
  const files = readdirSync(seedersDir).sort();
  for (const file of files) {
    if (!file.endsWith('.js')) continue;
    console.log(`  -> ${file}`);
    const seeder = await import(join(seedersDir, file));
    await seeder.up(sequelize.getQueryInterface(), sequelize.Sequelize);
  }
  console.log('Seeders done.');
}

const command = process.argv[2];
if (command === 'migrate') {
  await runMigrations();
} else if (command === 'seed') {
  await runSeeders();
} else if (command === 'all') {
  await runMigrations();
  await runSeeders();
} else {
  console.log('Usage: node src/scripts/migrate.js [migrate|seed|all]');
}

await sequelize.close();
