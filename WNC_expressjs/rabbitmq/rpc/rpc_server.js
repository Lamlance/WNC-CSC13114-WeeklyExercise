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
  const [queries, q_err] = await CallAndCatchAsync(
    ActorGetSchema.parseAsync,
    req.query
  );

  if (q_err != null) {
    return res.status(400).json({ error: "Invalid params" });
  }

  const [data, err] = await CallAndCatchAsync(GetActors, queries);

  if (err != null) {
    return res.status(500).json({ error: "Something happend :))" });
  }

  return data;
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

    channel.consume(queue, (msg) => {
      if (msg.content.toString() == "actors") {
        console.log(" [.] fib(%d)", n);

        const r = getAllActors();

        channel.sendToQueue(msg.properties.replyTo, Buffer.from(r.toString()), {
          correlationId: msg.properties.correlationId,
        });
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
