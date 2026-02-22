import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import connectDB from './config/mongodb.js';
import authRouter from './routes/auth.routes.js';
import userRouter from './routes/user.routes.js';
import logger from './config/logger.js';

const app = express();
const port = process.env.PORT || 4000;

const allowedOrigins = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',').map(origin => origin.trim())
    : ['http://localhost:5173']

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: allowedOrigins, credentials: true }));


//API Endpoints
app.get('/', (req, res) => {
    res.send('API is running...');
});

app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);


if (process.env.NODE_ENV !== 'test') {
    connectDB();
    app.listen(port, () => {
        logger.info(`Server is running on port ${port}`);
    });
}

export default app;