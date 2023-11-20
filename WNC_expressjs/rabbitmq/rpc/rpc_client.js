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
    const amqpServer = "ampq://localhost:5762";
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


app.post("/actors", (req, res) => {
  console.log(` [x] Requesting actor ${id}`);

  let correlationId = generateUuid();

  channel.consume(q.queue, (msg) => {
    if (msg.properties.correlationId == correlationId) {
      console.log(` [.] Got ${msg.content.toString()} `);
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
