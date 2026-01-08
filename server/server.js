const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.json({msg : 'Hello, World!'});
    });

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

//routes

app.use('/users', require('./routes/userRouter'));

//connect MongoDB

const URI = process.env.MONGODB_URL;

mongoose.connect(URI, {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('MongoDB connected successfully');
}).catch((err) => {
    console.error('MongoDB connection error:', err);
});