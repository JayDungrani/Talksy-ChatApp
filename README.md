# Talksy – Real-Time Chat Application

Talksy is a modern real-time chat application built with the MERN stack and Socket.IO, designed for seamless one-to-one and group communication.

## ✨ Features

- 🔥 Real-Time Messaging – Instant updates using Socket.IO

- 👥 Friend Requests – Chats are created only after the request is accepted

- 🗨 One-to-One Chat – Private messaging with friends

- 👨‍👩‍👧 Group Chat – Admin-controlled group messaging

   - ✏️ Change the group name

   - ➕ Add or remove members

   - 🖼 Update group profile picture

- 🔔 Notifications – Get alerts for friend requests

- 📝 Profile Setup – Customize your profile after signup

- 📌 Sorted Friend List – Friends are sorted by the latest message received


## 🛠 Tech Stack

- 🚀 Frontend: React.js, Tailwind CSS

- 🛠 Backend: Node.js, Express.js, MongoDB

- ⚡ Real-time Communication: Socket.IO

- 📦 State Management: Redux

- 🔐 Authentication: JWT

- ☁ Cloud Storage: Cloudinary

## 📦 Installation
### 1️⃣ Clone the Repository

```bash
git clone https://github.com/JayDungrani/Talksy-ChatApp.git
cd talksy
```

### 2️⃣ Install Dependencies
Run the following command in both the root and server directories:
```bash
npm install
```
### 3️⃣ Environment Variables 
Create a .env file in the root folder and add:
```env
VITE_API_BASE_URL='backend location'
```
Create another .env file in the server folder and add:
```env
PORT=5000
MONGO_URI='your-mongodb-uri'
JWT_SECRET='your-jwt-secret'
FRONTEND_URL='your-frontend-url'
CLOUDINARY_CLOUD_NAME='your-cloudinary-cloud-name'
CLOUDINARY_API_KEY='your-cloudinary-api-key'
CLOUDINARY_API_SECRET='your-cloudinary-api-secret'
```
### 4️⃣ Start the Development Server
#### ▶️ Start Backend
```bash
cd server
node index.js
```
#### ▶️ Start Frontend
```bash
npm run dev
```
