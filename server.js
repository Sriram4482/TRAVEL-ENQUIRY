const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const nodemailer = require('nodemailer');
const path = require('path');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.resolve(__dirname, 'public')));

// Connect to MongoDB using environment variables
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
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

// Configure Nodemailer using environment variables
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Serve index.html for the root route
app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
});

// Fallback for SPA (Optional)
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
});

// Handle Contact Form Submissions
app.post('/contact', async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    const newContact = new Contact({ name, email, phone, subject, message });
    await newContact.save();
    console.log('✅ Contact saved successfully!');

    // Email to Admin
    const adminMailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL,
      subject: `New Contact Form Submission from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nSubject: ${subject}\nMessage: ${message}`
    };

    // Confirmation Email to User
    const userMailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Thank You for Contacting Us!',
      text: `Hi ${name},\n\nThank you for reaching out! We have received your message and will get back to you soon.\n\nBest regards,\nTravel.com Team`
    };

    // Send Emails
    await transporter.sendMail(adminMailOptions);
    await transporter.sendMail(userMailOptions);

    res.json({ success: true, message: '✅ Thanks for contacting us! A confirmation email has been sent.' });
  } catch (error) {
    console.error('❌ Error saving contact:', error);
    res.status(500).json({ success: false, message: '❌ Error saving contact info.' });
  }
});

// Start Server
app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});