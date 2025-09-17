const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Optional, if you're submitting from a different origin

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Allow cross-origin requests if needed
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());

// Handle form submission
app.post('/form/', (req, res) => {
  console.log('Received form data:', req.body);
  // You can validate, store, or process the data here
  res.status(200).send('Form submitted successfully!');
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
