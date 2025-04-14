import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

import userRouter from './Routes/user.route.js';
import authRouter from './Routes/auth.route.js';
import contactRouter from './Routes/contact.route.js';
import vendorRouter from './Routes/vendor.route.js';
import requestRouter from './Routes/request.route.js';

dotenv.config();

const app = express();
const port = process.env.MY_PORT || 3000;

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URL, {
    dbname: process.env.MONGODB_DB_NAME
})
.then(() => {
    console.log('Connected to MongoDB');
}
)
.catch((error) => {
    console.log('Error:', error);
}
);

app.use(express.json());
app.use(cookieParser());



app.use('/backend/user', userRouter);
app.use('/backend/auth', authRouter);
app.use("/backend/contact", contactRouter);
app.use("/backend/vendor", vendorRouter);
app.use("/backend/requests", requestRouter);



app.use((err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message || "Something went wrong";
    res.status(status).json({ status, message, success: false });
});


app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`);
})