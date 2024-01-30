import { ObjectId } from 'mongoose';
import { Users, Admins, Courses } from '../db/index';
import { Request, Response, NextFunction } from "express";

export interface usertype {
    username: string,
    password: string,
    purchasedCourses: ObjectId[],
}

export interface admintype {
    username: string,
    password: string,
}

export const adminAuthentication = async (req: Request, res: Response, next: NextFunction) => {
    const { username, password } = req.headers;
    const admin: admintype | null = await Admins.findOne({ username: username, password: password });
    if (admin) {
        next();
    }
    else {
        res.json({ message: 'Incorrect username or password' });
    }
}

export const userAuthentication = async (req: Request, res: Response, next: NextFunction) => {
    const { username, password } = req.headers;
    const user: usertype | null = await Users.findOne({ username: username, password: password });
    if (user) {
        next();
    }
    else {
        res.json({ message: 'Incorrect username or password' });
    }
}