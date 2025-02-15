import { v4 as uuidv4 } from "uuid";
import db from "@/lib/db";  // Assuming you have a database connection
import sendEmail from "@/lib/send-email";
import bcrypt from "bcrypt";  // Add bcrypt for password hashing

// Function to validate email using regex
const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Function to check password strength
const isStrongPassword = (password) => {
    // Password must contain at least 8 characters, 1 uppercase letter, 1 number, and 1 special character
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
};

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    const { email, password } = req.body;

    // Validate email format
    if (!isValidEmail(email)) {
        return res.status(400).json({ error: "Invalid email format" });
    }

    // Check password strength
    if (!isStrongPassword(password)) {
        return res.status(400).json({
            error: "Password must be at least 8 characters long, contain 1 uppercase letter, 1 number, and 1 special character.",
        });
    }

    // Check if the user already exists
    const existingUser = await db.user.findUnique({ where: { email } });
    if (existingUser) {
        return res.status(400).json({ error: "User already exists" });
    }

    // Hash the password before storing it in the database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate verification token
    const token = uuidv4();

    // Save user with `verified: false` status
    await db.user.create({
        data: {
            email,
            password: hashedPassword, // Save hashed password
            verified: false,
            verificationToken: token,
        },
    });

    // Send confirmation email
    await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/send-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, token }),
    });

    return res.status(200).json({
        success: true,
        message: "Registration successful! Check your email for verification.",
    });
}
