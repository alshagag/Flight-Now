// lib/send-email.js
import nodemailer from 'nodemailer';

export default async function sendEmail(email, token) {
// Create and send email
    const emailSubject = "Verify your email";
    const emailBody = `Please click the following link to verify your email: 
    ${process.env.NEXT_PUBLIC_BASE_URL}/verify-email?token=${token}`;
    
// Set up nodemailer to send using Gmail or other email account
    const transporter = nodemailer.createTransport({
        service: "gmail", // or any other mail service
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

// Send email
    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: emailSubject,
        text: emailBody,
    });

    console.log("Verification email sent to: ", email);
}
