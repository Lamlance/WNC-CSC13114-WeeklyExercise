import RabbitMQConfig from "./config.js";
import "dotenv/config";

const queue = "order";
const rabbitMQConfig = new RabbitMQConfig();
await rabbitMQConfig.connect();
await rabbitMQConfig.subscribeToQueue(queue, (message) => {
  console.log("Received message:", JSON.parse(message));
});
