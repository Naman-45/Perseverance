import { Request, Response, NextFunction } from "express";
import { verify } from 'jsonwebtoken';
import jwt from 'jsonwebtoken';

type EnvironmentVariables = {
    secret_key_user: string;
    secret_key_admin: string;
};
const env: EnvironmentVariables = process.env as EnvironmentVariables

const secret_key_user: (string | undefined) = process.env.secret_key_user || 'IwillsettleForthis02';
const secret_key_admin: (string | undefined) = process.env.secret_key_admin || 'Alrightthisisit45';

export const jwtVerificationAdmin = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const Token = authHeader.split(' ')[1];
        jwt.verify(Token, secret_key_admin, (err, user) => {
            if (err) throw err;
            req.body = user;
            next();
        })
    }
    else {
        res.json({ message: 'Token authentication failed' });
    }
}

export const jwtVerificationUser = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const Token = authHeader.split(' ')[1];
        verify(Token, secret_key_user, (err, user) => {
            if (err) throw err;
            req.body = user;
            next();
        })
    }
    else {
        res.json({ message: 'Token authentication failed' });
    }
}