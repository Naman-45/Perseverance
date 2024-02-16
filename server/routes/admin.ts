import express, { json } from 'express';
import { Admins, Courses } from '../db/index'
import { jwtVerificationAdmin } from '../middlewares/jwt';
import jwt from 'jsonwebtoken';

interface admintype {
    username: string,
    password: string,
}

const app = express();

const secret_key_admin: (string | undefined) = process.env.secret_key_admin || 'Alrightthisisit45';

const generateTokenAdmin = (user: admintype) => {
    return jwt.sign(user, secret_key_admin);
}

app.post('/admin/signup', async (req, res) => {
    // logic to sign up admin
    try {
        const { username, password } = req.headers;
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

});

app.post('/login', async (req, res) => {

    const { username, password } = req.headers;
    const user = await Admins.findOne({ username: username, password: password }) as admintype
    if (user) {
        const token = generateTokenAdmin(user);
        res.json({ message: 'Admin Logged in successfully', token: token });
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