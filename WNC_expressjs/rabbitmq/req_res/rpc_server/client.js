import { connect } from "amqplib";

import Consumer from "./consumer.js";
import Producer from "./producer.js";
const RABBITMQ_HOST = "localhost";
const RABBITMQ_PORT = "8000";
const RABBITMQ_USERNAME = "guest";
const RABBITMQ_PASSWORD = "guest";
const RABBITMQ_VHOST = "";
const RABBITMQ_URL = `amqp://${RABBITMQ_USERNAME}:${RABBITMQ_PASSWORD}@${RABBITMQ_HOST}:${RABBITMQ_PORT}/${RABBITMQ_VHOST}`;
const rpcQueueName = "rpc_queue_rr";

class RabbitMQClient {
  constructor() {
    this.isInitialized = false;
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new RabbitMQClient();
    }
    return this.instance;
  }

  async initialize() {
    if (this.isInitialized) {
      return;
    }
    try {
      this.connection = await connect(RABBITMQ_URL);

      this.producerChannel = await this.connection.createChannel();
      this.consumerChannel = await this.connection.createChannel();

      const { queue: rpcQueue } = await this.consumerChannel.assertQueue(
        rpcQueueName,
        { exclusive: true }
      );

      this.producer = new Producer(this.producerChannel);
      this.consumer = new Consumer(this.consumerChannel, rpcQueue);

      this.consumer.consumeMessages();

      this.isInitialized = true;
    } catch (error) {
      console.log("rabbitmq error...", error);
    }
  }
  async produce(data, correlationId, replyToQueue) {
    if (!this.isInitialized) {
      await this.initialize();
    }
    return await this.producer.produceMessages(
      data,
      correlationId,
      replyToQueue
    );
  }
}

export default RabbitMQClient.getInstance();
