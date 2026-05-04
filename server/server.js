import express from 'express';
import cors from 'cors';
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
    : ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000'];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.error(`❌ CORS BLOCKED: Origin "${origin}" not in allowed list:`, allowedOrigins);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));

// Request Logger for debugging Render hits
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url} - Origin: ${req.headers.origin}`);
    next();
});

app.use(express.json());
app.use(cookieParser());


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