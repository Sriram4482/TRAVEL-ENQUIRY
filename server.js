const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const nodemailer = require('nodemailer');
const path = require('path');
require('dotenv').config(); // Load environment variables

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ MongoDB connected'))
    .catch(err => console.error('❌ MongoDB connection error:', err));


// Define Contact Schema
const contactSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    subject: String,
    message: String
});
const Contact = mongoose.model('Contact', contactSchema);

// Configure Nodemailer for Gmail SMTP
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'rollsrider582@gmail.com',
        pass: 'pkpa ymsn wwet nudp' // Use App Password
    }
});

// Serve the frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Handle Contact Form Submissions
app.post('/contact', async (req, res) => {
    try {
        const { name, email, phone, subject, message } = req.body;

        const newContact = new Contact({ name, email, phone, subject, message });
        await newContact.save();
        console.log("✅ Contact saved successfully!");

        // Send Admin Notification
        const adminMailOptions = {
            from: 'your-email@gmail.com',
            to: 'rollsrider@gmail.com',
            subject: `New Contact Form Submission from ${name}`,
            text: `
                Name: ${name}
                Email: ${email}
                Phone: ${phone}
                Subject: ${subject}
                Message: ${message}
            `
        };

        // Send User Confirmation
        const userMailOptions = {
            from: 'your-email@gmail.com',
            to: email,
            subject: 'Thank You for Contacting Us!',
            html: `
              <p>Hi ${name},</p>
              <p>Thank you for reaching out to us. We have received your message and will get back to you soon.</p>
              <p>Best regards,</p>
              <p><strong>Travel.com Team</strong></p>
            `
          };
          

        await transporter.sendMail(adminMailOptions);
        await transporter.sendMail(userMailOptions);

        return res.json({ success: true, message: '✅ Thanks for contacting us! A confirmation email has been sent.' });

    } catch (error) {
        console.error('❌ Error saving contact:', error);
        res.status(500).json({ success: false, message: '❌ Error saving contact info.' });
    }
});

// Start Server
app.listen(port, () => {
    console.log(`🚀 Server running on http://localhost:${port}`);
});
