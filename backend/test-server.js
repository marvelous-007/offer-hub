console.log("Starting server...");

const express = require('express');
const app = express();
const port = 4002;

app.get("/", (req, res) => {
  res.send("Test server working!");
});

app.listen(port, () => {
  console.log(`Test server running on port ${port}`);
});
