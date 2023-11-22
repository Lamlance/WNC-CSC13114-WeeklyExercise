import express from "express";
import bodyParser from "body-parser";
import constrollers from "./controller.js";

import "dotenv/config";
import cors from "cors";

const app = express();
const PORT = 3080;
const jsonParser = bodyParser.json();

app.options("*", cors());
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.status(200).json({
    Hello: "World",
  });
});

// Pub/Sub RabbitMQ
app.post("/api/pub", jsonParser, constrollers.sendMessage);

app.listen(PORT, (err) => {
  if (!err) {
    console.log(`Server running http://localhost:${PORT}`);
  } else {
    console.log("Error: ", err);
  }
});
