import 'dotenv/config';
import { pool } from '../database';
import type { RowDataPacket } from 'mysql2';

interface UserRow extends RowDataPacket {
  id: string;
  username: string;
  role: string;
  name: string;
  created_at: string;
}

async function main() {
  const [rows] = await pool.query<UserRow[]>(
    'SELECT id, username, role, name, created_at FROM users ORDER BY created_at'
  );

  if (rows.length === 0) {
    console.log('No users yet. Register/login once through the app to seed the database.');
  } else {
    console.table(
      rows.map((r) => ({
        username: r.username,
        role: r.role,
        name: r.name,
        created_at: r.created_at,
        id: r.id
      }))
    );
    console.log(`${rows.length} user(s) total.`);
  }

  await pool.end();
}

main().catch((err) => {
  console.error('Could not read users. Is MySQL running and configured in .env?');
  console.error(err);
  process.exit(1);
});
