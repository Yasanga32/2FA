import winston from 'winston';

const { combine, timestamp, printf, colorize, align } = winston.format;

const logFormat = printf((info) => {
    return `[${info.timestamp}] ${info.level}: ${info.message}`;
});

export const logger = winston.createLogger({
    level: process.env.NODE_ENV === 'test' ? 'error' : 'info',
    format: combine(
        colorize({ all: true }),
        timestamp({ format: 'YYYY-MM-DD hh:mm:ss.SSS A' }),
        align(),
        logFormat
    ),
    transports: [
        new winston.transports.Console()
        // If the user wants to log to a file, they could add:
        // new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
        // new winston.transports.File({ filename: 'logs/combined.log' })
    ],
});

export default logger;
