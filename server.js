const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const nodemailer = require('nodemailer');
const path = require('path');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
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
        user: 'rollsrider582@gmail.com',  // ✅ Your Gmail (Admin's email)
        pass: 'pkpa ymsn wwet nudp'      // ✅ Use App Password (not normal password)
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


        // 🔹 Email to Admin (YOU)
        const adminMailOptions = {
            from: 'your-email@gmail.com',  // ✅ Your email (sender)
            to: 'rollsrider@gmail.com',    // ✅ Your email (Admin receives)
            subject: `New Contact Form Submission from ${name}`,
            text: `
                Name: ${name}
                Email: ${email}
                Phone: ${phone}
                Subject: ${subject}
                Message: ${message}
            `
        };

        // 🔹 Email to User (Confirmation)
        const userMailOptions = {
            from: 'rollsrider@gmail.com',  // ✅ Your email (sender)
            to: email,                     // ✅ User's email (from form submission)
            subject: "Thank You for Contacting Us!",
            text: `
                Hi ${name},

                Thank you for reaching out! We have received your message and will get back to you soon.

                Best regards,
                Travel.com Team
            `
        };

        // Send Emails
        await transporter.sendMail(adminMailOptions);
        await transporter.sendMail(userMailOptions);

        return res.json({ success: true, message: '✅ Thanks for contacting us! A confirmation email has been sent to you.' });

    } catch (error) {
        console.error('❌ Error saving contact:', error);
        res.status(500).json({ success: false, message: '❌ Error saving contact info.' });
    }
});

// Start Server
app.listen(port, () => {
    console.log(`🚀 Server running on http://localhost:${port}`);
});
