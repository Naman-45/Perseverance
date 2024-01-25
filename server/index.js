const express = require('express');
const app = express();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const cors = require('cors');

app.use(cors());

app.use(express.json());

mongoose.connect('mongodb+srv://namandevv45:REoyCgljCUv02b7c@cluster0.sfelgwu.mongodb.net/Course-selling-website');

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  purchasedCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Courses' }]
});

const adminSchema = new mongoose.Schema({
  username: String,
  password: String
});

const courseSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  published: Boolean,
  imageLink: String
});

const Users = mongoose.model('Users', userSchema);
const Admins = mongoose.model('Admins', adminSchema);
const Courses = mongoose.model('Courses', courseSchema);

const secret_key_admin = process.env.secret_key_admin;
const secret_key_user = process.env.secret_key_user;

const adminAuthentication = (req, res, next) => {
  const { username, password } = req.headers;
  const admin = Admins.findOne({ username: username, password: password });
  if (admin) {
    next();
  }
  else {
    res.json({ message: 'Incorrect username or password' });
  }
}

const userAuthentication = (req, res, next) => {
  const { username, password } = req.headers;
  const user = Users.findOne({ username: username, password: password });
  if (user) {
    next();
  }
  else {
    res.json({ message: 'Incorrect username or password' });
  }
}

const generateTokenUserAdmin = (user) => {
  return jwt.sign(user, secret_key_user, { expiresIn: '1h' });
}

const generateTokenUser = (user) => {
  return jwt.sign(user, secret_key_admin, { expiresIn: '1h' });
}

const jwtVerificationAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const Token = authHeader.split(' ')[1];
    jwt.verify(Token, secret_key_admin, (err, user) => {
      if (err) throw err;
      req.user = user;
      next();
    })
  }
  else {
    res.json({ message: 'Token authentication failed' });
  }
}

const jwtVerificationUser = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const Token = authHeader.split(' ')[1];
    jwt.verify(Token, secret_key_user, (err, user) => {
      if (err) throw err;
      req.user = user;
      next();
    })
  }
  else {
    res.json({ message: 'Token authentication failed' });
  }
}
// Admin routes
app.post('/admin/signup', async (req, res) => {
  // logic to sign up admin
  try {
    const admin = req.headers;
    const existingAdmin = await Admins.findOne({ username: admin.username });
    if (existingAdmin) {
      res.json({ message: 'Admin already exists' });
    }
    else {
      const newAdmin = new adminSchema(admin)
      await newAdmin.save();
      res.json({ message: 'Admin created successfully' });
    }

  } catch (err) {

    console.error('Error while processing admin signup:', err);
    res.json({ message: 'Internal server error' });
  }

});

app.post('/admin/login', adminAuthentication, (req, res) => {
  // logic to log in admin
  Admins.findOne(req.headers).then((user) => {
    const token = generateTokenAdmin(user);
    res.json({ message: 'Logged in successfully', Token: token });
  })

});

app.post('/admin/courses', jwtVerificationAdmin, async (req, res) => {
  // logic to create a course
  const newCourse = new Courses(req.body);
  await newCourse.save();
  res.json({ message: 'Course created successfully' });
});

app.put('/admin/courses/:courseId', jwtVerificationAdmin, async (req, res) => {
  // logic to edit a course
  const cid = req.params.courseId;
  const updatedCourse = req.body;
  await Courses.findByIdAndUpdate(cid, { $set: { updatedCourse } }, { new: true });
  res.json({ message: 'Course updated successfully' });

});

app.get('/admin/courses', jwtVerificationAdmin, async (req, res) => {
  // logic to get all courses
  await Courses.find({}).then((courses) => {
    const allCourses = { Courses: { courses } };
    res.json(allCourses);
  });
});

// User routes
app.post('/users/signup', async (req, res) => {
  // logic to sign up user
  try {
    const user = { ...req.headers, purchasedCourses: [] };
    const existingUser = await Users.findOne({ username: user.username });
    if (existingUser) {
      res.json({ message: 'User already exists' });
    }
    else {
      const newUser = new adminSchema(user)
      await newUser.save();
      res.json({ message: 'User created successfully' });
    }

  } catch (err) {

    console.error('Error while processing user signup:', err);
    res.json({ message: 'Internal server error' });
  }


});

app.post('/users/login', userAuthentication, (req, res) => {
  // logic to log in user
  Users.findOne(req.headers).then((user) => {
    const token = generateTokenUser(user);
    res.json({ message: 'Logged in successfully', Token: token });
  })

});

app.get('/users/courses', jwtVerificationUser, async (req, res) => {
  // logic to list all courses
  await Courses.find({}).then((courses) => {
    const allCourses = { Courses: { courses } };
    res.json(allCourses);
  })
});

app.post('/users/courses/:courseId', jwtVerificationUser, async (req, res) => {
  // logic to purchase a course
  const cid = req.params.courseId;
  await Courses.findOne({ _id: cid }).then(async (course) => {
    await Users.findByIdAndUpdate(req.user._id, { $push: { purchasedCourses: course } }, { new: true });
    res.json({ message: 'Course purchased successfully' });
  })
});

app.get('/users/purchasedCourses', jwtVerificationUser, async (req, res) => {
  // logic to view purchased courses
  await Users.findOne(req.user).then((user) => {
    const allPurchasedCourses = { Courses: user.purchasedCourses };
    res.json(allPurchasedCourses);
  })
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
