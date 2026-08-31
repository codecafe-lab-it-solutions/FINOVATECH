import 'dotenv/config';
import { createUser, findUserByUsername } from '../db';
import { initSchema } from '../database';
import { pool } from '../database';

// Terminal-only admin provisioning — deliberately has no equivalent on the
// public site. Usage: npm run admin:create -- <username> <password> "<Full Name>"
async function main() {
  const [username, password, name] = process.argv.slice(2);

  if (!username || !password || !name) {
    console.log('Usage: npm run admin:create -- <username> <password> "<Full Name>"');
    console.log('Example: npm run admin:create -- ops.lead "S3cur3-Pass!23" "Jane Doe"');
    process.exit(1);
  }
  if (password.length < 8) {
    console.error('Refusing: admin passwords must be at least 8 characters.');
    process.exit(1);
  }

  await initSchema();

  const existing = await findUserByUsername(username);
  if (existing) {
    console.error(`"${username}" already exists (role: ${existing.role}). Choose a different username.`);
    process.exit(1);
  }

  const user = await createUser({ username, password, name, role: 'admin' });
  console.log(`Admin account created: ${user.username} (${user.name}). You can log in with it on the site's login page now.`);

  await pool.end();
}

main().catch((err) => {
  console.error('Could not create admin. Is MySQL running and configured in .env?');
  console.error(err);
  process.exit(1);
});
