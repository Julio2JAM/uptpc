import { Request, Response, NextFunction } from 'express';
import { HTTP_STATUS } from '../Base/statusHttp';
import jwt from 'jsonwebtoken';

const secret = "LaPromesa-JustinQuiles";

export function generateToken(payload: any): string {
  return jwt.sign(payload, secret, { expiresIn: '8h' });
}

export function verifyToken(token: string): any {
  try {
    const decoded = jwt.verify(token, secret) as { [key: string]: any };
    return decoded;
  } catch (error) {
    const response: { token: null, expiredAt: any } = {
      token: null,
      expiredAt: null
    }

    if (error && typeof error === "object" && "expiredAt" in error) {
      response.expiredAt = error.expiredAt;
    }
    return response
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
  if (!payload) {
    res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: 'Invalid token' });
    return;
  }

  req.user = payload;
  next();
}