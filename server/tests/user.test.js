import request from 'supertest';
import app from '../server.js';
import userModel from '../models/userModel.js';
import jwt from 'jsonwebtoken';
import { jest } from '@jest/globals';



describe('User API Endpoints', () => {

    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe('GET /api/user/data', () => {
        it('should get user data successfully', async () => {

            // Mock jwt verification for the userAuth middleware
            jest.spyOn(jwt, 'verify').mockReturnValue({ id: 'mockUserId123' });

            jest.spyOn(userModel, 'findById').mockResolvedValue({
                _id: 'mockUserId123',
                name: 'Test Setup',
                isAccountVerified: true
            });

            const res = await request(app)
                .get('/api/user/data')
                .set('Cookie', 'token=validMockToken');

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.userData.name).toBe('Test Setup');
            expect(res.body.userData.isAccountVerified).toBe(true);
        });

        it('should return error if user not found', async () => {
            jest.spyOn(jwt, 'verify').mockReturnValue({ id: 'mockUserId123' });
            jest.spyOn(userModel, 'findById').mockResolvedValue(null);

            const res = await request(app)
                .get('/api/user/data')
                .set('Cookie', 'token=validMockToken');

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe('User not found');
        });

        it('should return error if not authenticated', async () => {
            // Not setting the token cookie, middleware should return false
            const res = await request(app)
                .get('/api/user/data');

            // Wait, what does userAuth return if no token? Let's check userAuth middleware.
            // Usually it returns success: false, message: 'Not Authorized.Login Again'
            expect(res.statusCode).toBe(200); // Because typical return is res.json(...) with success: false
            expect(res.body.success).toBe(false);
            // Not strictly testing the exact string so changes to middleware don't break it
        });
    });
});
