import amqplib from "amqplib";
import express from "express";
import { GetActors } from "../../src/db/actors.js";
import { CallAndCatchAsync } from "../../src/utils/utils.js";

const app = express();

// parse the request body
app.use(express.json());

// port where the service will run
const PORT = 9006;

let connection;
let channel;
let q;

connect();

const getAllActors = async () => {
  try {
    const actors = await GetActors({ skip: 0, take: 10 });
    return actors;
  } catch (err) {
    return { msg: "Error when get actors" };
  }
};

async function connect() {
  try {
    const amqpServer = "amqp://localhost:5672";
    connection = await amqplib.connect(amqpServer);
    channel = await connection.createChannel();

    const queue = "rpc_queue";
    channel.assertQueue(queue, {
      durable: true,
    });

    channel.prefetch(1);
    console.log(" [x] Awaiting RPC requests.");

    channel.consume(queue, async (msg) => {
      if (msg.content.toString() == "actors") {
        console.log(" [.] Resolving request...");

        const r = await getAllActors();

        channel.sendToQueue(msg.properties.replyTo, Buffer.from(JSON.stringify(r)), {
          correlationId: msg.properties.correlationId,
        });
        console.log("Sended!");
      }
      channel.ack(msg);
    });
  } catch (error) {
    console.log(error);
  }
}

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
