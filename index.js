const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const cors = require("cors");
const Json2csvParser = require("json2csv").Parser;

let dealers = require("./dummyData100.json");

app.use(express.json());
app.use(cors());

app.get("/", (_, res) => res.send("<h1>Mock server for FFL</h1>"));

app.post("/import", (req, res) => {
  res.setHeaders("Access-Control-Allow-Origin", "*");
  res.json({ result: "Success" });
});

app.get("/dealers", (_, res) => {
  res.status(200).json(dealers);
});

app.get("/dealers/:id", (req, res) => {
  const dealer = dealers.find(dealer => dealer.id == req.params.id);

  if (dealer) {
    res.status(200).json(dealer);
  } else {
    res
      .status(404)
      .json({ id: Number(req.params.id), message: "Dealer not found" });
  }
});

app.get("/export", (req, res) => {
  // filterby enabled, disabled, preferred or not preferred
  let filterBy = req.query.filterBy;
  let newDealers = [];

  switch (filterBy.toLowerCase()) {
    case "all":
      newDealers = dealers;
      break;
    case "enabled":
      newDealers = dealers.filter(dealer => dealer.enabled);
      break;
    case "preferred":
      newDealers = dealers.filter(dealer => dealer.preferred);
      break;
    case "disabled":
      newDealers = dealers.filter(dealer => !dealer.enabled);
      break;
    case "not preferred":
      newDealers = dealers.filter(dealer => !dealer.preferred);
      break;
    default:
      newDealers = [];
  }

  if (newDealers.length === 0) {
    res.json({ message: "Invalid Filter" });
  } else {
    // Convert JSON to CSV data
    const fields = [
      "id",
      "name",
      "address",
      "city",
      "phoneNumber",
      "license",
      "state",
      "zip",
      "enabled",
      "preferred",
      "fees",
      "schedules"
    ];
    const opts = { fields };
    const json2csvParser = new Json2csvParser({ fields });
    const csvData = json2csvParser.parse(newDealers);

    // Send CSV File to Client
    res.setHeader("Content-disposition", "attachment; filename=dealers.csv");
    res.set("Content-Type", "text/csv");
    res.status(200).end(csvData);
  }
});

app.patch("/dealers/:id", (req, res) => {
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
