import { Request } from 'express';

export interface ExtendedRequest extends Request {
    user: { _id: string; email: string; role: string };
    keyStore: {};
    refreshToken: string;
}
