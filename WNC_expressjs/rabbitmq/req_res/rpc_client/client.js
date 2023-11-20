import { connect } from "amqplib";

import Consumer from "./consumer.js";
import Producer from "./producer.js";
import { EventEmitter } from "events";
const url = "amqp://localhost";
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
      this.connection = await connect(url);

      this.producerChannel = await this.connection.createChannel();
      this.consumerChannel = await this.connection.createChannel();

      const { queue: replyQueueName } = await this.consumerChannel.assertQueue(
        "",
        { exclusive: true }
      );

      this.eventEmitter = new EventEmitter();
      this.producer = new Producer(
        this.producerChannel,
        replyQueueName,
        this.eventEmitter
      );
      this.consumer = new Consumer(
        this.consumerChannel,
        replyQueueName,
        this.eventEmitter
      );

      this.consumer.consumeMessages();

      this.isInitialized = true;
    } catch (error) {
      console.log("rabbitmq error...", error);
    }
  }

  async produce(data) {
    if (!this.isInitialized) {
      await this.initialize();
    }
    return await this.producer.produceMessages(data);
  }
}

export default RabbitMQClient.getInstance();
