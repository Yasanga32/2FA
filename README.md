# Lanka Auth 🛡️ | Full-Stack Modern Authentication Solution

**Lanka Auth** is a state-of-the-art, recruiter-ready authentication system designed to showcase modern web security practices and premium UI/UX design. This project demonstrates a production-grade implementation of JWT-based authentication combined with Email Two-Factor Authentication (2FA).

---

## 💎 Project Overview
In today's web environment, security and user experience are paramount. **Lanka Auth** solves this by providing a robust security layer designed with a "Security-First" mindset, all while maintaining a high-end, **Glassmorphism-inspired** visual aesthetic that provides a premium feel on any device.

### 🌟 Key Highlights for Recruiters
- **End-to-End Security**: Implements industry-standard JWT for stateless authentication and Bcrypt for secure password hashing.
- **Email-Based 2FA**: A complete flow for account verification and password resets using dynamic 6-digit OTPs sent via SMTP.
- **Premium UI/UX**: Developed with **Tailwind CSS**, featuring dark-mode elements, vibrant gradients, and smooth micro-animations.
- **Production-Ready Core**: Structured to allow easy extension of user roles and features, with a clean separation of concerns between the API and the UI.

---

## 🛠️ Tech Stack & Architecture

### **Frontend**
- **React.js**: For a dynamic and responsive component-based UI.
- **Tailwind CSS**: Custom design system including glassmorphism and modern layout patterns.
- **Context API**: Efficient global state management for authentication and user sessions.
- **React-Toastify**: Professional real-time notification system.

### **Backend**
- **Node.js & Express**: High-performance API architecture.
- **MongoDB & Mongoose**: Flexible, efficient data modeling for user management.
- **JSON Web Token (JWT)**: Secure, encrypted cookie-based authentication.
- **Nodemailer**: Integrated with SMTP (Brevo) for reliable transactional emails.

---

## 📁 Core Project Capabilities

### 🔐 Multi-Factor Security
Lanka Auth doesn't just stop at passwords. It incorporates a full 2FA lifecycle:
1. **Account Verification**: Users must verify their email before accessing protected routes.
2. **Password Reset**: A secure 15-minute OTP window for password recovery.
3. **Session Management**: Secure, `httpOnly` cookie-based tokens to prevent XSS attacks.

### 🎨 State-of-the-Art Design
- **Glassmorphism**: Transparent, blurred backgrounds for a "modern tech" aesthetic.
- **Floating Animations**: Subtle CSS animations that make the interface feel alive.
- **Fully Responsive**: Zero-compromise layout from 4K monitors down to mobile phones.

---

## 🚀 Professional Installation

### 1. Prerequisites
- Node.js (v18+)
- MongoDB Atlas account
- SMTP Credentials (Brevo, SendGrid, or Gmail)

### 2. Configure Backend
1. `cd server`
2. `npm install`
3. Create a `.env` file with the following variables:
   ```env
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   NODE_ENV=development
   SENDER_EMAIL=your_email
   SMTP_USER=your_smtp_username
   SMTP_PASS=your_smtp_password
   ```
4. `npm run dev`

### 3. Configure Frontend
1. `cd client`
2. `npm install`
3. `npm run dev`

---

## 📜 API Specification (Overview)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/register` | User onboarding & initial OTP generation |
| `POST` | `/api/auth/login` | Secure JWT token issuance |
| `POST` | `/api/auth/send-verify-otp` | Request new 24h verification code |
| `POST` | `/api/auth/verify-account` | Activate user account status |
| `POST` | `/api/user/data` | Retrieve authenticated profile |

---

## 🏆 Conclusion
This project is a demonstration of my ability to architect, develop, and design a complex full-stack application. It combines deep technical security with high-level visual design, showcasing my versatility as a developer.

---
**Lanka Auth Team** | 🇱🇰 [View Project on GitHub](https://github.com/Yasanga32/2FA)
