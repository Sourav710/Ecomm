// ...existing code...
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const cookieParser = require('cookie-parser');
const app = express();


app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3000;
// Trim whitespace from env value

app.get('/', (req, res) => {
  res.json({ msg: 'API is running' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.use('/api', require('./routes/categoryRouter'));


const URI = process.env.MONGODB_URL && process.env.MONGODB_URL.trim();

const sanitizeMongoURI = (uri) => {
  if (!uri) return uri;
  try {
    const u = new URL(uri);
    ['useNewUrlParser','useUnifiedTopology','usenewurlparser','useunifiedtopology'].forEach(p => u.searchParams.delete(p));
    return u.toString();
  } catch (_) {
    // fallback: remove known params using regex
    return uri.replace(/([&?](useNewUrlParser|useUnifiedTopology|usenewurlparser|useunifiedtopology)=[^&]*)/gi,'').replace(/\?&/,'?').replace(/\?$/,'');
  }
};

const cleanURI = sanitizeMongoURI(URI);
console.log('MONGODB_URL snippet =', cleanURI ? cleanURI.slice(0, 60) + '...' : 'undefined');

// Start server only after DB connects
mongoose.connect(cleanURI)
  .then(() => {
    console.log('MongoDB connected successfully');
    // register routes after DB connection
    app.use('/users', require('./routes/userRouter'));
    app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
// ...existing code...