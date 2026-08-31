import jwt from 'jsonwebtoken';
import type { UserRole } from './db';

const JWT_SECRET = process.env.JWT_SECRET || 'finovatech-dev-secret-change-me';
const TOKEN_TTL = '7d';

export interface TokenPayload {
  sub: string;
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
