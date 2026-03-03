import { expect } from 'chai';
import sinon from 'sinon';
import userModel from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import transporter from '../config/nodemailer.js';

describe('Mocha Fixtures & Sinon Mocking Demo', () => {

    // Fixtures (Setup/Teardown)
    beforeEach(() => {
        // These stubs prevent actual database, bcrypt, and email calls
        sinon.stub(userModel, 'findOne');
        sinon.stub(userModel.prototype, 'save');
        sinon.stub(bcrypt, 'hash');
        sinon.stub(bcrypt, 'compare');
        sinon.stub(jwt, 'sign');
        sinon.stub(transporter, 'sendMail');
    });

    afterEach(() => {
        // Restores all stubs to their original state to prevent side effects on other tests
        sinon.restore();
    });

    it('should demonstrate that stubs are initialized in beforeEach', () => {
        // Check if the functions are indeed Sinon stubs
        expect(userModel.findOne.restore).to.be.a('function');
        expect(bcrypt.hash.restore).to.be.a('function');
        expect(transporter.sendMail.restore).to.be.a('function');
    });

    it('should show stubbed behavior for userModel.findOne', async () => {
        // Configure the stub for this specific test
        const mockUser = { email: 'test@example.com', name: 'Test User' };
        userModel.findOne.resolves(mockUser);

        const result = await userModel.findOne({ email: 'test@example.com' });

        expect(result).to.deep.equal(mockUser);
        expect(userModel.findOne.calledOnce).to.be.true;
    });

    it('should show stubbed behavior for bcrypt.hash', async () => {
        bcrypt.hash.resolves('mocked_hash_value');

        const hash = await bcrypt.hash('password123', 10);

        expect(hash).to.equal('mocked_hash_value');
        expect(bcrypt.hash.calledWith('password123', 10)).to.be.true;
    });
});
