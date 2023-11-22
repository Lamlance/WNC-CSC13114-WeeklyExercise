import express from "express";
import RabbitMQClient from "./client.js";
const PORT = 3090;
const server = express();
server.use(express.json()); // you need the body parser middleware

server.get("/api/actor", async (req, res, next) => {
  console.log(`Requesting actors`);
  const response = await RabbitMQClient.produce("actors");
  res.send({ response });
});

server.listen(PORT, async () => {
  console.log(`Server running http://localhost:${PORT}`);
  RabbitMQClient.initialize();
});
