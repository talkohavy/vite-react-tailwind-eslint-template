/* eslint-disable */
const cors = require('cors');
const express = require('express');
const path = require('path');
const app = express();
const PORT = 3003;

const distFolderName = 'dist1';

// Configure CORS to allow requests from localhost:3000
const corsOptions = {
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, distFolderName)));

// Route for the main iframe page
app.get('/', (_req, res) => {
  res.sendFile(path.join(__dirname, distFolderName, 'index.html'));
});

// Route for the "/base" page that the button will navigate to
app.get('/base', (_req, res) => {
  res.sendFile(path.join(__dirname, distFolderName, 'base.html'));
});

app.listen(PORT, () => {
  console.log(`Iframe server running on http://localhost:${PORT}`);
});
