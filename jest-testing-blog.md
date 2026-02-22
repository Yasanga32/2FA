# How to Master Jest & Supertest in Node.js (A Practical Guide to Mocking)

If you're building a Node.js backend with Express and MongoDB, writing tests can feel intimidating. You might ask yourself: *"Do I need a separate test database?"* or *"Will my automated tests accidentally send real verification emails to users?"*

To solve these problems, we use **Mocking**. 

In this tutorial, I'll show you exactly how I set up **Jest** and **Supertest** for my authentication system (Lanka Auth), complete with ES Module support and advanced mocking techniques.

---

## 1. The Setup: Jest + ES Modules

Modern Node.js projects use ES Modules (`import`/`export` instead of `require`). Jest defaults to the older CommonJS format, which often leads to the dreaded `SyntaxError: Cannot use import statement outside a module`.

To fix this, we need a few specific packages. Let's install them as development dependencies:

```bash
npm install -D jest supertest cross-env
```

Next, update your `package.json` to configure Jest for ES Modules. The secret sauce is the `--experimental-vm-modules` flag!

```json
{
  "type": "module",
  "scripts": {
    "test": "cross-env NODE_ENV=test NODE_OPTIONS=--experimental-vm-modules jest --detectOpenHandles --forceExit"
  },
  "jest": {
    "testEnvironment": "node",
    "transform": {}
  }
}
```

*Note: We use `cross-env NODE_ENV=test` so our Express app knows it's running in a test environment and doesn't try to connect to the real MongoDB database or start the active server port!*

---

## 2. Preparing the Server

Supertest needs access to your Express `app` object without the server actually listening on a port. If the server is actively listening, Jest will hang waiting for it to close.

Update your `server.js` (or `app.js`) to conditionally listen to the port:

```javascript
// server.js
import express from 'express';
// ... other imports ...

const app = express();

if (process.env.NODE_ENV !== 'test') {
    // Only connect to the real DB and listen to the port when NOT testing
    connectDB();
    app.listen(4000, () => {
        console.log(`Server is running on port 4000`);
    });
}

// Export the app so Supertest can use it
export default app;
```

---

## 3. The Magic of Mocking with `jest.spyOn()`

Mocking allows us to fake functions that reach out to the real world (like saving a user to MongoDB, sending an email with Nodemailer, or hashing a password with bcrypt).

When using ES Modules, the safest and cleanest way to mock these dependencies is using `jest.spyOn()`. 

Let's test our `/api/auth/register` route. Create a file called `tests/auth.test.js`:

```javascript
import request from 'supertest';
import app from '../server.js';
import userModel from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import transporter from '../config/nodemailer.js';
import { jest } from '@jest/globals';

describe('Auth API Endpoints', () => {

    // Clean up our fakes after every test!
    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe('POST /api/auth/register', () => {
        it('should register a new user successfully', async () => {
            
            // --- 1. ARRANGE (The Setup) ---
            
            // Fake the DB: Pretend the user doesn't exist yet
            jest.spyOn(userModel, 'findOne').mockResolvedValue(null);
            
            // Fake Bcrypt: Instantly return a fake hashed password
            jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPassword123');

            // Fake userModel.save(): Pretend we saved the user to MongoDB
            jest.spyOn(userModel.prototype, 'save').mockResolvedValue(true);

            // Fake JWT: Pretend we generated a secure token
            jest.spyOn(jwt, 'sign').mockReturnValue('mockJwtToken');
            
            // Fake Nodemailer: Pretend the welcome email was sent successfully
            jest.spyOn(transporter, 'sendMail').mockResolvedValue(true);


            // --- 2. ACT (The Execution) ---
            
            // Use Supertest to simulate a real HTTP request
            const res = await request(app)
                .post('/api/auth/register')
                .send({
                    name: 'John Doe',
                    email: 'john@example.com',
                    password: 'securepassword123'
                });

            // --- 3. ASSERT (The Verification) ---
            
            // Did our API return a 200 OK status?
            expect(res.statusCode).toBe(200);
            
            // Did our API return the success JSON structure?
            expect(res.body.success).toBe(true);
            expect(res.body.message).toBe('User registered successfully');

            // Did it set the JWT cookie correctly?
            const cookies = res.headers['set-cookie'];
            expect(cookies).toBeDefined();
            expect(cookies[0]).toMatch(/token=mockJwtToken/);
        });
    });
});
```

### Why Do We Do This?
If we didn't mock `userModel.prototype.save` or `transporter.sendMail`, our test suite would literally create a new user in our live database and send a real email to `john@example.com` every single time we typed `npm test`. By mocking, our tests are **isolated, safe, and lightning fast**!

---

## 4. Testing Protected Routes (Mocking Middleware)

What if a route requires an authenticated user? For example, fetching user data or verifying an account OTP. 

Usually, you have a middleware (like `userAuth`) that checks the JWT cookie. To test this, we just need to spy on `jwt.verify` and provide a fake valid token block!

```javascript
describe('POST /api/auth/verify-account', () => {
    it('should verify account successfully', async () => {
        
        const mockSave = jest.fn().mockResolvedValue(true);
        
        // 1. Trick the userAuth middleware into thinking our token is instantly valid
        jest.spyOn(jwt, 'verify').mockReturnValue({ id: 'mockUserId123' });
        
        // 2. Pretend the database found an unverified user
        jest.spyOn(userModel, 'findById').mockResolvedValue({
            _id: 'mockUserId123',
            isAccountVerified: false,
            verifyOtp: '123456',
            verifyOtpExpireAt: Date.now() + 100000, // Valid time
            save: mockSave
        });

        const res = await request(app)
            .post('/api/auth/verify-account')
            // Pass a fake cookie so the middleware grabs it easily
            .set('Cookie', 'token=validMockToken') 
            .send({
                userId: 'mockUserId123',
                otp: '123456'
            });

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe('Email verified successfully');
        
        // Prove that user.save() was actually called to update the DB!
        expect(mockSave).toHaveBeenCalledTimes(1);
    });
});
```

## Conclusion

Testing an Express backend doesn't mean standing up complex Docker containers or temporary databases. By properly mocking Mongoose, JWTs, and external services using `jest.spyOn()`, you can instantly verify your business logic with 100% confidence.

Run `npm test`, watch those green checkmarks light up, and ship your project!
