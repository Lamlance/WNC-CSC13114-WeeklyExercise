import amqplib from "amqplib";
import express from "express";

const app = express();

app.use(express.json());

function generateUuid() {
  return (
    Math.random().toString() +
    Math.random().toString() +
    Math.random().toString()
  );
}

const PORT = 9005;

let connection;
let channel;
let q;


async function connect() {
  try {
    const amqpServer = "amqp://localhost:5672";
    connection = await amqplib.connect(amqpServer);
    channel = await connection.createChannel();

    q = await channel.assertQueue("", {
      exclusive: true,
    });
  } catch (err) {
    console.log(err);
  }
};

connect();


app.get("/actors", (req, res) => {
  console.log(` [x] Requesting actors`);

  let correlationId = generateUuid();

  console.log(q);
  channel.consume(q.queue, (msg) => {
    if (msg.properties.correlationId == correlationId) {
      console.log(` [.] Got result! `);
      return res.status(200).json(JSON.parse(msg.content));
    }
  }, {
    noAck: true
  });

  channel.sendToQueue("rpc_queue", Buffer.from("actors"), {
    correlationId: correlationId,
    replyTo: q.queue
  });
});

app.get("*", (req, res) => {
  res.status(404).send("Not exist url path");
});

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
