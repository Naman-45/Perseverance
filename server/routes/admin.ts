import { sign, verify } from 'jsonwebtoken';
import express, { json } from 'express';
import { Users, Admins, Courses } from '../db/index'
import { jwtVerificationAdmin } from '../middlewares/jwt';
import jwt from 'jsonwebtoken';
import { adminAuthentication } from '../middlewares/auth';
import { admintype } from '../middlewares/auth'

const app = express();

type EnvironmentVariables = {
    secret_key_user: string;
    secret_key_admin: string;
};
const env: EnvironmentVariables = process.env as EnvironmentVariables

const secret_key_user: string = env.secret_key_user;
const secret_key_admin: string = env.secret_key_admin;


const generateTokenAdmin = (user: admintype) => {
    return jwt.sign(user, secret_key_admin, { expiresIn: '1h' });
}


app.post('/admin/signup', async (req, res) => {
    // logic to sign up admin
    try {
        const admin = req.headers;
        const existingAdmin = await Admins.findOne({ username: admin.username });
        if (existingAdmin) {
            res.json({ message: 'Admin already exists' });
        }
        else {
            const newAdmin = new Admins(admin)
            await newAdmin.save();
            res.json({ message: 'Admin created successfully' });
        }

    } catch (err) {

        console.error('Error while processing admin signup:', err);
        res.json({ message: 'Internal server error' });
    }

});

app.post('/login', adminAuthentication, async (req, res) => {
    // logic to log in admin
    const user = await Admins.findOne(req.headers) as admintype
    if (user) {
        const token = generateTokenAdmin(user);
        res.json({ message: 'Logged in successfully', Token: token });
    }
    else {
        res.json({ message: 'Admin not found' });
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