const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const PORT = 5000;
const userData = require("../data/data.json");
const axios = require("axios");
let userCount = 5;

app.use(bodyParser.json());

app.listen(5000, () => {
  console.log(`Server started on port ${PORT}`);
});

app.get("/", function (req, res) {
  res.send("Hello from backend");
});

app.get("/users", function (req, res) {
  res.send(userData);
});

app.get("/users/:id", function (req, res) {
  const userId = req.params.id;

  const index = userData.findIndex((curr) => curr.id == userId);
  if (index >= 0) {
    res.send(userData[index]);
  } else {
    res.sendStatus(404);
  }
});

async function getCardData() {
  try {
    const response = await axios.get(`https://randommer.io/api/Card`, {
      headers: { "X-Api-Key": "f3b80c8d2c6a478e89445e919e625fff" },
    });
    return response.data;
  } catch (exception) {
    console.log(exception);
    return null;
  }
}

app.post("/users", async function (req, res) {
  const body = req.body;
  console.log(body);

  body.id = userCount++;
  body.status = "PENDIENTE";
  body.assignedAnalyst = "David";

  body.cardInfo = await getCardData();
  if (body.cardInfo == null) {
    res.sendStatus(500);
    return;
  }

  delete body.cardInfo.fullName;

  console.log("Saving user: ");
  console.log(body);
  userData.push(body);

  res.status(201).send(body);
});

app.patch("/users/:id", function (req, res) {
  const userId = req.params.id;
  const body = req.body;
  console.log(userId);
  console.log(body);

  // Asumiendo el usuario edita todo junto sin validar
  const index = userData.findIndex((curr) => curr.id == userId);
  if (index < 0) {
    res.send(404);
    return;
  }

  userData[index] = body;

  res.status(200).send(userData[index]);
});

app.delete("/users/:id", function (req, res) {
  const userId = req.params.id;
  console.log(userId);
  const index = userData.findIndex((curr) => curr.id == userId);
  if (index >= 0) {
    userData.splice(index, 1);
    res.sendStatus(204);
  } else {
    res.sendStatus(404);
  }
});
