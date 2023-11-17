import express from "express";
import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";
const PROTO_PATH = "./grpc/test.proto";
const PORT = 3034;

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  arrays: true,
});
const message_proto = grpc.loadPackageDefinition(packageDefinition);

const grpc_server = new grpc.Server();

grpc_server.addService(message_proto.message.TestMessageService.service, {
  Send: (msg, callback) => {
    callback(null, { message: `Hello ${msg.request.message}` });
  },
});

grpc_server.bindAsync(
  `127.0.0.1:${PORT}`,
  grpc.ServerCredentials.createInsecure(),
  function (err, port) {
    if (err != null) {
      throw err;
    }
    console.log(`Server grpc A running at http://127.0.0.1:${port}`);
    grpc_server.start();
  }
);
