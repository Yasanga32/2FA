import request from 'supertest';
import app from '../server.js';
import userModel from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import transporter from '../config/nodemailer.js';
import { jest } from '@jest/globals';



describe('Auth API Endpoints', () => {

    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe('POST /api/auth/register', () => {
        it('should register a new user successfully', async () => {
            jest.spyOn(userModel, 'findOne').mockResolvedValue(null);
            jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPassword123');

            //mock userModel instance behavior
            jest.spyOn(userModel.prototype, 'save').mockResolvedValue(true);

            jest.spyOn(jwt, 'sign').mockReturnValue('mockJwtToken');
            jest.spyOn(transporter, 'sendMail').mockResolvedValue(true);

            const res = await request(app)
                .post('/api/auth/register')
                .send({
                    name: 'Test Setup',
                    email: 'test@example.com',
                    password: 'password123'
                });

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.message).toBe('User registered successfully');

            const cookies = res.headers['set-cookie'];
            expect(cookies).toBeDefined();
            expect(cookies[0]).toMatch(/token=mockJwtToken/);
        });

        it('should fail if user already exists', async () => {
            jest.spyOn(userModel, 'findOne').mockResolvedValue({ email: 'test@example.com' });

            const res = await request(app)
                .post('/api/auth/register')
                .send({
                    name: 'Existing Setup',
                    email: 'test@example.com',
                    password: 'password123'
                });

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe('User with this email already exists');
        });

        it('should fail validation if missing fields', async () => {
            const res = await request(app)
                .post('/api/auth/register')
                .send({
                    email: 'test@example.com'
                });

            expect(res.statusCode).toBe(400);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe('Please provide name, email and password');
        });
    });

    describe('POST /api/auth/login', () => {
        it('should login successfully with correct credentials', async () => {
            jest.spyOn(userModel, 'findOne').mockResolvedValue({
                _id: 'mockUserId123',
                email: 'test@example.com',
                password: 'hashedPassword123'
            });
            jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);
            jest.spyOn(jwt, 'sign').mockReturnValue('mockJwtToken');

            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'test@example.com',
                    password: 'password123'
                });

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.message).toBe('Login successful');

            const cookies = res.headers['set-cookie'];
            expect(cookies).toBeDefined();
            expect(cookies[0]).toMatch(/token=mockJwtToken/);
        });

        it('should fail login if user not found', async () => {
            jest.spyOn(userModel, 'findOne').mockResolvedValue(null);

            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'notfound@example.com',
                    password: 'password123'
                });

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe('Invalid email');
        });

        it('should fail login if password incorrect', async () => {
            jest.spyOn(userModel, 'findOne').mockResolvedValue({
                _id: 'mockUserId123',
                email: 'test@example.com',
                password: 'hashedPassword123'
            });
            jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);

            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'test@example.com',
                    password: 'wrongpassword'
                });

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe('Invalidpassword');
        });
    });

    describe('POST /api/auth/logout', () => {
        it('should logout successfully', async () => {
            const res = await request(app)
                .post('/api/auth/logout');

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.message).toBe('Logout successful');

            const cookies = res.headers['set-cookie'];
            expect(cookies).toBeDefined();
            expect(cookies[0]).toMatch(/token=;/);
        });
    });

    describe('POST /api/auth/send-verify-otp', () => {
        it('should send verify OTP successfully', async () => {
            const mockSave = jest.fn().mockResolvedValue(true);
            jest.spyOn(jwt, 'verify').mockReturnValue({ id: 'mockUserId123' });
            jest.spyOn(userModel, 'findById').mockResolvedValue({
                _id: 'mockUserId123',
                email: 'test@example.com',
                isAccountVerified: false,
                save: mockSave
            });
            jest.spyOn(transporter, 'sendMail').mockResolvedValue(true);

            const res = await request(app)
                .post('/api/auth/send-verify-otp')
                .set('Cookie', 'token=validMockToken')
                .send({
                    userId: 'mockUserId123'
                });

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.message).toBe('Verification OTP sent to your email');
            expect(mockSave).toHaveBeenCalledTimes(1);
        });

        it('should return error if account is already verified', async () => {
            jest.spyOn(jwt, 'verify').mockReturnValue({ id: 'mockUserId123' });
            jest.spyOn(userModel, 'findById').mockResolvedValue({
                _id: 'mockUserId123',
                email: 'test@example.com',
                isAccountVerified: true
            });

            const res = await request(app)
                .post('/api/auth/send-verify-otp')
                .set('Cookie', 'token=validMockToken')
                .send({
                    userId: 'mockUserId123'
                });

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe('Account is already verified');
        });
    });

    describe('POST /api/auth/verify-account', () => {
        it('should verify account successfully', async () => {
            const mockSave = jest.fn().mockResolvedValue(true);
            jest.spyOn(jwt, 'verify').mockReturnValue({ id: 'mockUserId123' });
            jest.spyOn(userModel, 'findById').mockResolvedValue({
                _id: 'mockUserId123',
                isAccountVerified: false,
                verifyOtp: '123456',
                verifyOtpExpireAt: Date.now() + 100000,
                save: mockSave
            });

            const res = await request(app)
                .post('/api/auth/verify-account')
                .set('Cookie', 'token=validMockToken')
                .send({
                    userId: 'mockUserId123',
                    otp: '123456'
                });

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.message).toBe('Email verified successfully');
            expect(mockSave).toHaveBeenCalledTimes(1);
        });

        it('should fail verify account if OTP is expired', async () => {
            jest.spyOn(jwt, 'verify').mockReturnValue({ id: 'mockUserId123' });
            jest.spyOn(userModel, 'findById').mockResolvedValue({
                _id: 'mockUserId123',
                isAccountVerified: false,
                verifyOtp: '123456',
                verifyOtpExpireAt: Date.now() - 100000 // Expired
            });

            const res = await request(app)
                .post('/api/auth/verify-account')
                .set('Cookie', 'token=validMockToken')
                .send({
                    userId: 'mockUserId123',
                    otp: '123456'
                });

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe('OTP Expired');
        });

        it('should fail verify account if OTP is invalid', async () => {
            jest.spyOn(jwt, 'verify').mockReturnValue({ id: 'mockUserId123' });
            jest.spyOn(userModel, 'findById').mockResolvedValue({
                _id: 'mockUserId123',
                isAccountVerified: false,
                verifyOtp: '123456',
                verifyOtpExpireAt: Date.now() + 100000
            });

            const res = await request(app)
                .post('/api/auth/verify-account')
                .set('Cookie', 'token=validMockToken')
                .send({
                    userId: 'mockUserId123',
                    otp: '987654'
                });

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe('Invalid OTP');
        });
    });

    describe('GET /api/auth/is-auth', () => {
        it('should check if user is authenticated successfully', async () => {
            // Because userAuth middleware adds userId to req.body, 
            // In a real integration test, we'd need to mock userAuth or pass a valid token.
            // Since we're passing through app directly, and we haven't mocked the userAuth middleware here,
            // we should be careful. Actually userAuth relies on req.cookies.token.
            // For now, let's just assert our endpoint response assuming userAuth let it pass.
            // Instead, we might need to mock userAuth middleware if it fails.

            // Wait, for this to pass through `userAuth`, we have to mock `jsonwebtoken.verify` and provide a token.
            jest.spyOn(jwt, 'verify').mockReturnValue({ id: 'mockUserId123' });

            const res = await request(app)
                .get('/api/auth/is-auth')
                // .set('Cookie', ['token=validMockToken']);
                // supertest provides cookies like this
                .set('Cookie', 'token=validMockToken');

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
        });
    });

    describe('POST /api/auth/send-reset-otp', () => {
        it('should send reset OTP successfully', async () => {
            const mockSave = jest.fn().mockResolvedValue(true);
            jest.spyOn(userModel, 'findOne').mockResolvedValue({
                _id: 'mockUserId123',
                email: 'test@example.com',
                save: mockSave
            });
            jest.spyOn(transporter, 'sendMail').mockResolvedValue(true);

            const res = await request(app)
                .post('/api/auth/send-reset-otp')
                .send({
                    email: 'test@example.com'
                });

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(mockSave).toHaveBeenCalledTimes(1);
        });
    });

    describe('POST /api/auth/reset-password', () => {
        it('should reset password successfully', async () => {
            const mockSave = jest.fn().mockResolvedValue(true);
            jest.spyOn(userModel, 'findOne').mockResolvedValue({
                _id: 'mockUserId123',
                email: 'test@example.com',
                resetOtp: '123456',
                resetOtpExpireAt: Date.now() + 100000,
                save: mockSave
            });
            jest.spyOn(bcrypt, 'hash').mockResolvedValue('newHashedPassword123');

            const res = await request(app)
                .post('/api/auth/reset-password')
                .send({
                    email: 'test@example.com',
                    otp: '123456',
                    newPassword: 'newPassword123'
                });

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.message).toBe('Password has been reset successfully');
            expect(mockSave).toHaveBeenCalledTimes(1);
        });
    });
});
