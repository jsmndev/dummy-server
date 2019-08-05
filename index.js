const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const cors = require("cors");

const dummyData = require("./dummyData.json");

app.use(cors());

app.get("/", (_, res) => res.send("Hello"));

app.get("/dealers", (_, res) => {
  res.status(200).json(dummyData);
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
