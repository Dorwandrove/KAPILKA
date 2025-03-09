const express = require('express');
const router = require('./routes');
const connectDB = require('./lib/connect');
const cookieParser = require('cookie-parser'); 
const cors = require('cors');//אפליקציה שמגדירה איזה קליינטים יכולים לקבל הודעות
const path = require('path');

const app = express();
app.use(cookieParser());
app.use(express.json());

// localhost:3000/api/sign-in
// localhost:3000/api/add-income

app.use(
  cors({
    origin: ['http://localhost:5173','https://kapilka-agvz.onrender.com'],
    credentials: true,
  })
)

//fix deploy 4 - the resecrations

app.use('/api',router);

app.get('*', (req, res
  ) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(3000, () => {
  connectDB();
  console.log('Server is running on http://localhost:3000');
});