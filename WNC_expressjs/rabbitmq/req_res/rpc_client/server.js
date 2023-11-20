import express from "express";
import RabbitMQClient from "./client.js";
const PORT = 3090;
const server = express();
server.use(express.json()); // you need the body parser middleware

server.post("/operate", async (req, res, next) => {
  console.log(req.body);
  const response = await RabbitMQClient.produce(req.body);
  res.send({ response });
});

server.listen(PORT, async () => {
  console.log(`Server running http://localhost:${PORT}`);
  RabbitMQClient.initialize();
});
