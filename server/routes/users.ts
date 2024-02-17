import express, { json } from 'express';
import { Users, Courses } from '../db/index'
import { jwtVerificationUser } from '../middlewares/jwt';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongoose';
import { userInput } from '../zod/types';

interface usertype {
    _id: ObjectId,
    username: string,
    password: string,
    purchasedCourses: ObjectId[]
}

interface admintype {
    _id: ObjectId,
    username: string,
    password: string,
}

const app = express();

const secret_key_user: (string | undefined) = process.env.secret_key_user || 'IwillsettleForthis02';

const generateTokenUser = (userid: ObjectId) => {
    const payload = {
        _id: userid
    }
    return jwt.sign(payload, secret_key_user)
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
            const user = { username: username, password: password, purchasedCourses: [] }
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
    }

});

app.post('/login', async (req, res) => {
    // logic to log in user
    const parsedInput = userInput.safeParse(req.body);
    if (!parsedInput.success) {
        res.status(411).json({
            message: parsedInput.error
        })
    }
    if (parsedInput.success) {
        const username = parsedInput.data.username;
        const password = parsedInput.data.password;
        const user = await Users.findOne({ username: username, password: password }) as usertype
        if (user) {
            const token = generateTokenUser(user._id);
            res.json({ message: 'User Logged in successfully', token: token });
        }
        else {
            res.json({ message: 'User not found' });
        }
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