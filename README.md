# Chatly Messenger

Chatly Messenger is a real-time chat application built with **React**, **Node.js**, **Express**, **MongoDB**, and **Socket.IO**. Users can register, login, set up their profile with a bio and avatar (Cloudinary), and chat in real-time.

Both **frontend** and **backend** are deployed on **Render**.

**Live Preview:** [Chatly Messenger](https://chatly-messenger-frontend.onrender.com/)

---

## Features

- User registration and login
- Profile setup with bio and avatar (Cloudinary)
- Real-time messaging with Socket.IO
- MongoDB Atlas for data storage
- Both frontend and backend deployed on Render

---

## Tech Stack

- **Frontend:** React.js, Tailwind CSS, Lucide Icons
- **Backend:** Node.js, Express.js
- **Database:** MongoDB Atlas
- **File Storage:** Cloudinary
- **Real-time:** Socket.IO
- **Deployment:** Render (frontend + backend)

---

## Environment Variables

### Backend (`.env`)

```env
MONGO_URI=your_mongodb_connection_string
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
