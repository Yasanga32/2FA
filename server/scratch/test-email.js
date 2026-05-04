import nodemailer from 'nodemailer';
import 'dotenv/config';

async function testEmail() {
    console.log("Testing SMTP Connection...");
    console.log("Host: smtp-relay.brevo.com");
    console.log("User:", process.env.SMTP_USER);
    // Don't log the full password for security, but check if it exists
    console.log("Pass defined:", !!process.env.SMTP_PASS);

    const transporter = nodemailer.createTransport({
        host: 'smtp-relay.brevo.com',
        port: 587,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });

    try {
        await transporter.verify();
        console.log("✅ Success! SMTP connection is valid.");
    } catch (error) {
        console.error("❌ SMTP Verification Failed:");
        console.error(error.message);
        if (error.message.includes('535')) {
            console.log("\nTIP: The '535' error means your SMTP Login or SMTP Key is incorrect.");
            console.log("Please double-check them in your Brevo dashboard under Settings > SMTP & API.");
        }
    }
}

testEmail();
