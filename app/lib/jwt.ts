import jwt, { SignOptions } from "jsonwebtoken";

interface JwtPayload {
  _id: string;
  [key: string]: unknown;
}

export function signJwtToken(payload: JwtPayload, options: SignOptions = {}): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }
  const token = jwt.sign(payload, secret, options);
  return token;
}

export function verifyJwtToken(token: string): JwtPayload | null {
  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("JWT_SECRET is not defined in environment variables");
    }
    const payload = jwt.verify(token, secret) as JwtPayload;
    return payload;
  } catch (error) {
    console.error("JWT verification failed:", error);
    return null;
  }
}