# 🚆 Rail Madad Complaint Registration System

**Rail Madad Complaint Registration** is a web-based application developed as part of the **Smart India Hackathon (SIH) 2024** for the **Indian Railway Department**. This project was designed to streamline the process of lodging and managing complaints within the Indian Railways system.

It aims to enhance the passenger experience by providing a user-friendly interface for complaint registration and an efficient backend for administrators to manage and resolve issues promptly.

## 🏆 About the Project

This project was developed during **Smart India Hackathon 2024**, one of the largest innovation competitions in India, under the problem statement provided by the **Indian Railway Department**. The solution focuses on digitizing and optimizing the complaint redressal mechanism using modern web technologies and real-time notification systems.

## 🧰 Tech Stack

- **Frontend**: React.js, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **Notifications**: Nodemailer (Email), Twilio (SMS)
- **Deployment**: [Specify if deployed; e.g., Heroku, Vercel, etc.]

## 🚀 Features

### User Module

- **Complaint Registration**: Users can lodge complaints related to various railway services.
- **Real-time Tracking**: Monitor the status of submitted complaints.
- **Notifications**: Receive updates via email and SMS regarding complaint status.
- **User Authentication**: Secure login and registration system.

### Admin Module

- **Dashboard**: Overview of all complaints with filtering options.
- **Complaint Management**: Assign, update, and resolve complaints.
- **User Management**: View and manage registered users.
- **Analytics**: Generate reports on complaint trends and resolutions.

## 🛠️ Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/raikat105/rail-madad-complaint-registration.git
   cd rail-madad-complaint-registration
   ```

2. **Install dependencies:**
   ```bash
   # For backend
   cd backend
   npm install

   # For frontend
   cd ../frontend
   npm install
   ```

3. **Configure environment variables:**
   - Create a `.env` file in both `backend` and `frontend` directories.
   - Add necessary environment variables as per the sample `.env.example` files.

4. **Run the application:**
   ```bash
   # Start backend server
   cd backend
   npm start

   # Start frontend development server
   cd ../frontend
   npm start
   ```

5. **Access the application:**
   - Frontend: `http://localhost:3000`
   - Backend API: `http://localhost:5000`

## 📁 Project Structure

```
rail-madad-complaint-registration/
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.js
├── package.json
└── README.md
```


## 🧑‍💻 Contributors

- [Raikat](https://github.com/raikat105) - *BackEnd Developer, ML*
- [Subhajit](https://github.com/subhajit-sen) - *BackEnd Developer and Testing*
- [Ishan](https://github.com/ishan0069) - *FrontEnd Developer*
- [Shreya](https://github.com/shreyakalyani) - *AIML and FrontEnd*
- [Sanchali](https://github.com/SanchaliJana) - *ML and DS Models*
- [Madhulina](https://github.com/Madhulina1234) - *FrontEnd Developer*
