const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const cors = require("cors");
// For file export
const Json2csvParser = require("json2csv").Parser;
// For file import
const multer = require('multer');
// Folder to which the file has been saved
const upload = multer({ dest: 'uploads/' });
// csv file to json array
const csvToJson = require('csvtojson');

let dealers = require("./dummyData100.json");

let importedDealers = [];

// middlewares
app.use(express.json());
app.use(cors());

// helper functions
function cleanupJson(data) {
  let newData = [];
  for (let i = 0; i < data.length; i += 1) {
    data[i].id = JSON.parse(data[i].id);
    data[i].enabled = JSON.parse(data[i].enabled);
    data[i].preferred = JSON.parse(data[i].preferred);
    data[i].fees = JSON.parse(data[i].fees);
    data[i].businessHours = JSON.parse(data[i].businessHours);
    newData.push(data[i]);
  }

  return newData;
}


// ROUTES
// This is just a test route
app.get("/", (_, res) => res.send("<h1>Mock server for FFL</h1>"));

// Fetch all dealers
app.get("/dealers", (_, res) => {
  importedDealers = cleanupJson(importedDealers);

  for (let i = 0; i < dealers.length; i += 1) {
    console.log("DEALERS", dealers[i]);
  }

  res.status(200).json([...dealers, ...importedDealers]);
});

// Fetch a single dealer
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


// Exports all the data
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

// Upload data from local
app.post("/import", upload.single("statement"), async (req, res) => {
  let file = req.file;
  importedDealers = await csvToJson().fromFile(file.path);
  res.send({ message: "Uploaded file successfully!" });
});

// Updates a dealer
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
