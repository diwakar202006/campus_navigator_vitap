require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const facultyRoutes = require('./routes/faculty');

const app = express();
app.use(express.json());

const FRONTEND_URL = process.env.FRONTEND_URL || '*'; // in dev you can keep '*'
app.use(cors({ origin: FRONTEND_URL }));

const uri = process.env.MONGODB_URI;
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(()=> console.log('Connected to MongoDB Atlas'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

app.use('/api/faculty', facultyRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend listening on ${PORT}`));
