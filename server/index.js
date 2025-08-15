const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const DbConnect = require('./db/db');
const AuthRoute = require('./routes/AuthRoute');
const userRoute = require('./routes/userRoutes');
const path = require('path');
const fs = require('fs');
const { getAllUsers } = require('./controllers/fetchUsers');
const { initSocket } = require('./socket/socket'); 
const messageRoutes = require("./routes/messaeRoutes");

const http = require('http');

dotenv.config();

const app = express();
app.use(cors({
  origin: 'https://chatly-messenger-frontend.onrender.com', 
  credentials: true
}));

app.use(express.json());

DbConnect();

const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

app.use('/auth', AuthRoute);
app.use('/user', userRoute);
app.get('/users', getAllUsers);
app.use("/messages", messageRoutes);

const PORT = process.env.PORT || 4000;


const server = http.createServer(app);


initSocket(server);

server.listen(PORT, () => {
  console.log(`Server connected on port: ${PORT}`);
});
