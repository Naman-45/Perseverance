import express, { json } from 'express';
import { connect } from 'mongoose';
import cors from 'cors';
import adminRoutes from './routes/admin';
import userRoutes from './routes/users'



const app = express();

app.use(cors());
app.use(json());

app.use('/admin', adminRoutes);
app.use('/users', userRoutes);


connect('mongodb+srv://namandevv45:REoyCgljCUv02b7c@cluster0.sfelgwu.mongodb.net/Course-selling-website', { dbName: 'Course-selling-website' });

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
