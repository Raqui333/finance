import { Request } from 'express';

// global.d.ts
declare global {
  interface JwtRequest extends Request {
    user: {
      sub: number;
      username: string;
      iat: number;
      exp: number;
    };
  }
}

export {};
