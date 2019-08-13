const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const cors = require("cors");
const Json2csvParser = require("json2csv").Parser;

let dealers = require("./dummyData.json");

app.use(express.json());
app.use(cors());

app.get("/", (_, res) => res.send("<h1>Mock server for FFL</h1>"));

app.get("/dealers", (_, res) => {
  res.status(200).json(dealers);
});

app.get("/dealers/:id", (req, res) => {
  const dealer = dealers.find(dealer => dealer.id == req.params.id);

  if (dealer) {
    res.status(200).json(dealer);
  } else {
    console.log("DEALER", dealer);
    res
      .status(404)
      .json({ id: Number(req.params.id), message: "Dealer not found" });
  }
});

app.get("/export", (_, res) => {
  // Convert JSON to CSV data
  const csvFields = [
    "id",
    "name",
    "address",
    "city",
    "phoneNumber",
    "licenseNumber",
    "state",
    "zipCode",
    "enabled",
    "preferred",
    "associatedFees",
    "hoursOfOperation"
  ];
  const json2csvParser = new Json2csvParser({ csvFields });
  const csvData = json2csvParser.parse(dealers);

  // Send CSV File to Client
  res.setHeader("Content-disposition", "attachment; filename=dealers.csv");
  res.set("Content-Type", "text/csv");
  res.status(200).end(csvData);
});

app.post("/import", (req, res) => {
  res.send(
    { result: "Success" 
    , body: req.body } );
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

    res.json({
      id: dealer.id,
      message: "Dealer updated"
    });
  } else {
    res.status(404).json({ msg: "Dealer not found" });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
