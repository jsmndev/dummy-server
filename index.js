const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const cors = require("cors");

let dealers = require("./dummyData.json");

app.use(express.json());
app.use(cors());

app.get("/", (_, res) => res.send("Hello"));

app.get("/dealers", (_, res) => {
  res.status(200).json(dealers);
});

app.post("/import", (req, res) => {
  res.send('Success')
});

app.put("/dealers/:id", (req, res) => {
  const { id } = req.params;
  const dealerIndex = dealers.findIndex(d => d.id == id);

  if (dealerIndex > -1) {
    const dealer = { ...dealers[dealerIndex], ...req.body };

    dealers = [
      ...dealers.slice(0, dealerIndex),
      dealer,
      ...dealers.slice(dealerIndex + 1)
    ];

    res.json(dealers);
  } else {
    res.status(404).json({ msg: "Dealer not found" });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
