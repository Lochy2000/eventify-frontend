const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Priority serve any static files
app.use(express.static(path.resolve(__dirname, './build')));

// All requests not handled by static files will return the React app
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, './build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});