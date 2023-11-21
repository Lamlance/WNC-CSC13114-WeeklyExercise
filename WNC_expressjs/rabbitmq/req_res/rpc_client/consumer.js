export default class Consumer {
  constructor(channel, replyQueueName, eventEmitter) {
    this.channel = channel;
    this.replyQueueName = replyQueueName;
    this.eventEmitter = eventEmitter;
  }

  async consumeMessages() {
    console.log("Ready to consume messages...");

    this.channel.consume(
      this.replyQueueName,
      (message) => {
        console.log(
          "the reply is.. :  An new actor is added with id :",
          JSON.parse(message.content.toString())
        );
        this.eventEmitter.emit(
          message.properties.correlationId.toString(),
          message
        );
      },
      {
        noAck: true,
      }
    );
  }
}
