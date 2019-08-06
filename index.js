const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const cors = require("cors");

const dummyData = require("./dummyData.json");

app.use(express.json());
app.use(cors());

app.get("/", (_, res) => res.send("Hello"));

app.get("/dealers", (_, res) => {
  res.status(200).json(dummyData);
});

app.put("/dealers/:id", (req, res) => {
  const { id } = req.params;
  const {
    name,
    address,
    city,
    phoneNumber,
    licenseNumber,
    state,
    zipCode,
    enabled,
    preferred
  } = req.body;
  const findDealerById = dealer => dealer.id == id;
  const foundDealer = dummyData.find(findDealerById);

  if (!foundDealer) {
    return sendUserError("No Dealer found by that ID", res);
  } else {
    if (name) foundDealer.name = name;
    if (address) foundDealer.address = address;
    if (city) foundDealer.city = city;
    if (phoneNumber) foundDealer.phoneNumber = phoneNumber;
    if (licenseNumber) foundDealer.licenseNumber = licenseNumber;
    if (state) foundDealer.state = state;
    if (zipCode) foundDealer.zipCode = zipCode;
    if (enabled) foundDealer.enabled = enabled;
    if (preferred) foundDealer.preferred = preferred;
    res.json(dummyData);
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
