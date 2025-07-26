import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET!;

export interface TokenPayload {
  userId: string;
  role: string;
  iat: number;
  exp: number;
}

export const generateToken = (userId: string, role: string) => {
  return jwt.sign({ userId, role }, JWT_SECRET, { expiresIn: '30d' });
};

export const verifyToken = (token: string): TokenPayload | null => {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch (error) {
    return null;
  }
};

// Make getSession asynchronous
export const getSession = async (): Promise<TokenPayload | null> => {
  const cookieStore = cookies();
  const token = (await cookieStore).get('session')?.value;
  if (!token) return null;
  return verifyToken(token);
};

export const hashPassword = async (password: string) => {
  const bcrypt = await import('bcryptjs');
  return bcrypt.hash(password, 10);
};

export const comparePasswords = async (password: string, hash: string) => {
  const bcrypt = await import('bcryptjs');
  return bcrypt.compare(password, hash);
};