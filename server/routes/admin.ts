import express, { json } from 'express';
import { Admins, Courses } from '../db/index'
import { jwtVerificationAdmin } from '../middlewares/jwt';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongoose';
import { userInput } from '../zod/types';


interface admintype {
    _id: ObjectId,
    username: string,
    password: string,
}
const app = express();

const secret_key_admin: (string | undefined) = process.env.secret_key_admin || 'Alrightthisisit45';

const generateTokenAdmin = (userid: ObjectId) => {
    const payload = {
        _id: userid
    }
    return jwt.sign(payload, secret_key_admin)
}

app.post('/admin/signup', async (req, res) => {
    // logic to sign up admin
    const parsedInput = userInput.safeParse(req.body);
    if (!parsedInput.success) {
        res.status(411).json({
            message: parsedInput.error
        })
    }
    if (parsedInput.success) {
        const username = parsedInput.data.username;
        const password = parsedInput.data.password;

        try {
            const existingAdmin = await Admins.findOne({ username: username });
            if (existingAdmin) {
                res.json({ message: 'Admin already exists' });
            }
            else {
                const admin = { username: username, password: password }
                const newAdmin = new Admins(admin)
                await newAdmin.save();
                res.json({ message: 'Admin created successfully' });
            }

        } catch (err) {

            console.error('Error while processing admin signup:', err);
            res.json({ message: 'Internal server error' });
        }
    }

});

app.post('/login', async (req, res) => {

    const parsedInput = userInput.safeParse(req.body);
    if (!parsedInput.success) {
        res.status(411).json({
            message: parsedInput.error
        })
    }
    if (parsedInput.success) {
        const username = parsedInput.data.username;
        const password = parsedInput.data.password;

        const user = await Admins.findOne({ username: username, password: password }) as admintype
        if (user) {
            const token = generateTokenAdmin(user._id);
            res.json({ message: 'Admin Logged in successfully', token: token });
        }
        else {
            res.json({ message: 'Admin not found' });
        }
    }

});

app.post('/courses', jwtVerificationAdmin, async (req, res) => {
    // logic to create a course
    const newCourse = new Courses(req.body);
    await newCourse.save();
    res.json({ message: 'Course created successfully' });
});

app.put('/courses/:courseId', jwtVerificationAdmin, async (req, res) => {
    // logic to edit a course
    const cid = req.params.courseId;
    const updatedCourse = req.body;
    await Courses.findByIdAndUpdate(cid, { $set: { updatedCourse } }, { new: true });
    res.json({ message: 'Course updated successfully' });

});

app.get('/courses', jwtVerificationAdmin, async (req, res) => {
    // logic to get all courses
    await Courses.find({}).then((courses) => {
        const allCourses = { Courses: { courses } };
        res.json(allCourses);
    });
});

export default app