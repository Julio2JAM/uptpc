import { Request, Response, NextFunction } from 'express';
import { HTTP_STATUS } from '../Base/statusHttp';
import jwt, { JwtPayload } from 'jsonwebtoken';

const secret = "LaPromesa-JustinQuiles";

export function generateToken(payload: any): string {
  return jwt.sign(payload, secret, { expiresIn: '8h' });
}

export function verifyToken(token: string): JwtPayload | { error: string } {
  try {
    const decoded: string | JwtPayload = jwt.verify(token, secret);
    if (typeof decoded === 'string') {
      throw new Error(decoded);
    }
    return decoded;
  } catch (error: any) {
    return {
      error: error?.message ?? "Error verifying token"
    };
  }
}

export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: 'Authorization header missing' });
    return;
  }

  const [bearer, token] = authHeader.split(' ');
  if (bearer !== 'Bearer' || !token) {
    res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: 'Invalid authorization header' });
    return;
  }

  const payload = verifyToken(token);

  if ("error" in payload) {
    res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: payload });
    return;
  }

  req.user = payload.user?.id;
  next();
}