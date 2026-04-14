# MERN Portfolio Website

A full-stack portfolio web application built using the MERN stack that demonstrates real-world development practices including authentication, REST API design, database integration, and dynamic UI rendering.
The system includes both a public-facing portfolio and a secure admin dashboard for managing projects and messages.

## 🚀 Features

- Single-page application with smooth scrolling navigation
- Interactive hero section with animations and dynamic effects
- Fully responsive design optimized for all devices
- Dark / Light mode theme switching
- Animated UI using Framer Motion
- Backend-powered contact system with MongoDB storage
- Secure admin dashboard with JWT authentication
- Full CRUD system for project management (Create, Read, Update, Delete)
- RESTful API integration between frontend and backend

## 🛠 Tech Stack

This project follows a full-stack MERN architecture:

Frontend:
- React.js for UI development
- Tailwind CSS for styling
- Framer Motion for animations
- Axios for API communication
- React Router for navigation

Backend:
- Node.js & Express.js for REST API development
- MongoDB with Mongoose for database management
- JWT for authentication and security

Tools & Deployment:
- Vite for frontend build tooling
- Git & GitHub for version control
- Vercel / Render for deployment

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/esubalew7/portfolio-mern.git
   cd portfolio-mern
   ```

2. **Install server dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install client dependencies**
   ```bash
   cd ../client
   npm install
   ```

4. **Environment Setup**

   Create a `.env` file in the server directory:
   ```
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   NODE_ENV=development
   ```

5. **Start the development servers**

   **Terminal 1 - Backend:**
   ```bash
   cd server
   npm run dev
   ```

   **Terminal 2 - Frontend:**
   ```bash
   cd client
   npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## 📸 Screenshots

### Hero Section
Modern landing page with animated background and responsive layout.

### Admin Dashboard
Secure dashboard for managing projects and messages.

### Projects Section
Dynamic project display with filtering and animations.

### Contact System
Functional form connected to backend API with validation.

## 🌐 Live Demo

Check out the live version of this portfolio: [https://portfolio-mern-one-rho.vercel.app/](https://portfolio-mern-one-rho.vercel.app/)

## 👨‍💻 Author

**Esubalew Molla**
Full-Stack MERN Developer

- GitHub: https://github.com/esubalew7  
- LinkedIn: https://www.linkedin.com/in/esubalew-molla-7a584739b  
- Email: esunalew392@gmail.com  

Passionate about building scalable web applications and modern UI experiences using the MERN stack.


## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](../../issues).

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

Designed and developed as a full-stack demonstration of modern web development practices using the MERN stack.