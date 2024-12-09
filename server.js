// server.js
const express = require('express');
const app = express();

// Simple route to keep the bot alive
app.get('/', (req, res) => {
  res.send('Bot is alive!');
});

// Start the server on port 3000
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
