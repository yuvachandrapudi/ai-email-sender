# 📬 AI Email Sender

A full-stack application that generates and sends professional emails using AI (Groq API + Nodemailer). Users can input a prompt to generate an email, edit it, and send it to any recipient after securely logging in with their Gmail credentials.

---

## 🚀 Features

- 🔐 Gmail login using App Password (secure, not stored in repo)
- 🤖 AI-powered email generation via Groq LLaMA3 API
- ✉️ Email sending via Nodemailer and Gmail
- 🎨 Clean animated UI with toast notifications
- 👤 Profile icon with login/logout handling and popup login modal

---

## 🧠 Technologies Used

- React (Frontend)
- Express (Backend)
- Groq API (LLaMA3)
- Nodemailer (Gmail sending)
- dotenv (env management)
- Toastify & React Icons

---

## 📁 Project Structure

ai-email-sender/
├── client/ # React frontend
├── server/ # Express backend
│ ├── index.js # Main server logic
│ └── .env # Environment file (ignored)
├── .gitignore
├── README.md


---

## ⚙️ Setup Instructions

1. **Clone this repository**
```bash
git clone https://github.com/yuvachandrapudi/ai-email-sender.git
cd ai-email-sender
```
2.Install dependencies
``` bash
cd client && npm install
cd ../server && npm install
```
3.Setup environment variables

Create a file server/.env using the sample below:

GROQ_API_KEY=your_groq_api_key_here

4.Run the application
```bash
# In /server
node index.js

# In /client (new terminal)
npm start
```
🔒 Security Notes
Your .env file is ignored via .gitignore

Never commit .env or your app passwords

Use .env.example to guide other users

✅ Future Improvements
Google OAuth login

Rich-text email editor

Email preview pane

Deployment to Vercel / Render




