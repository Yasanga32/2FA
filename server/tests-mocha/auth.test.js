import request from 'supertest';
import { expect } from 'chai';
import sinon from 'sinon';
import app from '../server.js';
import userModel from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import transporter from '../config/nodemailer.js';


//Behaviour driven development syntax
//using describe and it blocks for clear test structure

describe('Auth Tests', () => {


    //Fixtures (Setup/Teardown)
    //using Hooks to reset stubs before and after each test.

    beforeEach(() => {
        sinon.stub(userModel, 'findOne');
        sinon.stub(userModel.prototype, 'save');
        sinon.stub(bcrypt, 'hash');
        sinon.stub(bcrypt, 'compare');
        sinon.stub(jwt, 'sign');
        sinon.stub(transporter, 'sendMail');
    });

    afterEach(() => {
        sinon.restore();
    });

    describe('Registration', () => {
        it('should register a user', async () => {

            //Mocking or Stubbing
            //using Sinon to simulate database and logic behavior

            userModel.findOne.resolves(null);
            userModel.prototype.save.resolves(true);
            bcrypt.hash.resolves('hashed123');
            jwt.sign.returns('token123');

            const res = await request(app)
                .post('/api/auth/register')
                .send({ name: 'John', email: 'j@example.com', password: '123' });


            //Assertions
            //using Chai

            expect(res.statusCode).to.equal(200);
            expect(res.body.success).to.be.true;
            expect(res.body.message).to.equal('User registered successfully');
        });

        it('should return error if user already exists', async () => {
            userModel.findOne.resolves({ email: 'j@example.com' });

            const res = await request(app)
                .post('/api/auth/register')
                .send({ name: 'John', email: 'j@example.com', password: '123' });

            //controller returns 200 with success: false for existing users
            expect(res.statusCode).to.equal(200);
            expect(res.body.success).to.be.false;
        });
    });

    describe('Login', () => {
        it('should login a user', async () => {
            userModel.findOne.resolves({ email: 'j@example.com', password: 'hashed' });
            bcrypt.compare.resolves(true);
            jwt.sign.returns('token123');

            const res = await request(app)
                .post('/api/auth/login')
                .send({ email: 'j@example.com', password: '123' });

            expect(res.statusCode).to.equal(200);
            expect(res.body.success).to.be.true;
        });
    });
});
