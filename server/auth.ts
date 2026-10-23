import jwt from 'jsonwebtoken';
import type { UserRole } from './db';

export function jwtSecret(env: NodeJS.ProcessEnv): string {
  const secret = env.JWT_SECRET || 'finovateck-dev-secret-change-me';
  if (env.NODE_ENV === 'production' && (secret.length < 32 || /change-me|MY_|dev-secret/i.test(secret))) {
    throw new Error('Production requires a unique JWT_SECRET of at least 32 characters.');
  }
  return secret;
}
const JWT_SECRET = jwtSecret(process.env);
const TOKEN_TTL = '7d';

export interface TokenPayload {
  sub: string;
  sid: string;
  username: string;
  role: UserRole;
  name: string;
}

export function signToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_TTL });
}

export function verifyToken(token: string): TokenPayload {
  return jwt.verify(token, JWT_SECRET) as TokenPayload;
}
