import { sign, verify } from 'jsonwebtoken';
import express, { json } from 'express';
import { Users, Courses } from '../db/index'
import { jwtVerificationUser } from '../middlewares/jwt';
import { admintype, userAuthentication } from '../middlewares/auth';
import jwt from 'jsonwebtoken';
import { usertype } from '../middlewares/auth';
import { ObjectId } from 'mongoose';

const app = express();


// type EnvironmentVariables = {
//     secret_key_user: string;
//     secret_key_admin: string;
// };
// const env: EnvironmentVariables = process.env as EnvironmentVariables

// const secret_key_user: string = env.secret_key_user;

const secret_key_user: (string | undefined) = process.env.secret_key_user || 'IwillsettleForthis02';

const generateTokenUser = (user: usertype) => {
    return jwt.sign(user, secret_key_user, { expiresIn: '1h' });
}


app.get('/me', jwtVerificationUser, async (req, res) => {
    const user = await Users.findOne({ username: req.body.username });
    if (!user) {
        res.status(404).json({ message: 'User does not exists' });
    }
    else {
        res.status(200).json({
            username: user.username
        })
    }
})

app.post('/signup', async (req, res) => {
    // logic to sign up user
    try {
        const user = { ...req.headers as unknown as admintype, purchasedCourses: [] as ObjectId[] }
        const existingUser = await Users.findOne({ username: user.username });
        if (existingUser) {
            res.status(409).json({ message: 'User already exists' });
        }
        else {
            const newUser = new Users(user)
            await newUser.save();
            res.status(201).json({ message: 'User created successfully' });
        }

    } catch (err) {

        console.error('Error while processing user signup:', err);
        res.status(500).json({ message: 'Internal server error' });
    }


});

app.post('/login', userAuthentication, async (req, res) => {
    // logic to log in user
    const user = await Users.findOne(req.headers) as usertype

    if (user) {
        const token = generateTokenUser(user);
        res.json({ message: 'Logged in successfully', Token: token });
    }
    else {
        res.json({ message: 'User not found' });
    }
});

app.get('/courses', jwtVerificationUser, async (req, res) => {
    // logic to list all courses
    await Courses.find({}).then((courses) => {
        const allCourses = { Courses: { courses } };
        res.json(allCourses);
    })
});

app.post('/courses/:courseId', jwtVerificationUser, async (req, res) => {
    // logic to purchase a course
    const cid = req.params.courseId;
    await Courses.findOne({ _id: cid }).then(async (course) => {
        await Users.findByIdAndUpdate(req.body._id, { $push: { purchasedCourses: course } }, { new: true });
        res.json({ message: 'Course purchased successfully' });
    })
});

app.get('/purchasedCourses', jwtVerificationUser, async (req, res) => {
    // logic to view purchased courses
    await Users.findOne(req.body).then((user) => {
        const allPurchasedCourses = { Courses: req.body.purchasedCourses };
        res.json(allPurchasedCourses);
    })
});

export default app