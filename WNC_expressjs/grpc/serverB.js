import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";
import express from "express";

const PROTO_PATH = "./grpc/test.proto";
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  arrays: true,
});

/** @type {grpc.ServiceClientConstructor} */
const TestMessageService =
  grpc.loadPackageDefinition(packageDefinition).message.TestMessageService;
const client = new TestMessageService(
  "127.0.0.1:3034",
  grpc.credentials.createInsecure()
);

const app = express();
const PORT = 3035;
app.use(express.json());
app.use("/", function (req, res) {
  const data = { message: req.query.name || "unknow user" };
  client.Send(data, function (err, data) {
    return res.status(200).json({
      ...data,
      error: err,
    });
  });
});

app.listen(PORT, function () {
  console.log(`Server B listen at http://localhost:${PORT}`);
});
