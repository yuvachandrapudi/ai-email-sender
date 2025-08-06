// index.js
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const fs = require('fs');
require('dotenv').config();
const axios = require('axios');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

let isLoggedIn = false;
let savedEmail = '';

// Endpoint to generate email content using Groq AI
app.post('/generate-email', async (req, res) => {
    const { prompt } = req.body;

    try {
        const response = await axios.post(
            'https://api.groq.com/openai/v1/chat/completions',
            {
                model: "llama3-70b-8192",
                messages: [
                    {
                        role: "user",
                        content: `Write a professional email based on the following prompt: ${prompt}`,
                    },
                ],
                temperature: 0.7,
                max_tokens: 500,
            },
            {
                headers: {
                    'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
                    'Content-Type': 'application/json',
                },
            }
        );
        

        const aiContent = response.data.choices[0].message.content;
        res.json({ email: aiContent });
    } catch (err) {
        console.error("Groq API error:", err.response?.data || err.message);
        console.log("Current GROQ API Key:", process.env.GROQ_API_KEY);
        res.status(500).json({ error: 'Failed to generate email using Groq' });
    }
});

// Save user credentials to .env file and mark as logged in

app.post('/update-credentials', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Missing email or password" });
  }

  const envPath = path.resolve(__dirname, '.env');

  // Load current env values
  let env = {};
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf-8').split('\n');
    lines.forEach(line => {
      if (line.includes('=')) {
        const [key, ...vals] = line.split('=');
        env[key.trim()] = vals.join('=').trim();
      }
    });
  }

  // Update credentials (but preserve others)
  env.EMAIL = email;
  env.EMAIL_PASS = password;

  // Convert back to file string
  const newEnvContent = Object.entries(env)
    .map(([k, v]) => `${k}=${v}`)
    .join('\n');

  // Write back to .env
  fs.writeFileSync(envPath, newEnvContent);

  res.json({ success: true });
});


// Check login status
app.get('/check-login', (req, res) => {
    res.json({ loggedIn: isLoggedIn, email: savedEmail });
});

// Login endpoint
app.post('/logout', (req, res) => {
  try {
    const envPath = path.resolve(__dirname, '.env');
    let content = fs.readFileSync(envPath, 'utf-8');

    content = content
      .replace(/^EMAIL=.*$/m, '')
      .replace(/^EMAIL_PASS=.*$/m, '');

    fs.writeFileSync(envPath, content.trim() + '\n');

    res.json({ success: true });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ success: false });
  }
});

// Send email using saved credentials
app.post('/send-email', async (req, res) => {
    if (!isLoggedIn) {
        return res.status(403).json({ error: 'User not logged in' });
    }

    const { to, subject, text } = req.body;
    try {
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASS,
            },
        });

        await transporter.sendMail({
            from: process.env.EMAIL,
            to,
            subject,
            text,
        });

        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Email Send Failed" });
    }
});

app.listen(5000, () => console.log('Server started on port 5000'));
