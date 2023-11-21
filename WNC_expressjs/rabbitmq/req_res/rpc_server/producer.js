export default class Producer {
  constructor(channel) {
    this.channel = channel;
  }

  async produceMessages(data, correlationId, replyToQueue) {
    console.log("Responding with : An new actor is added with id : ", data);
    this.channel.sendToQueue(replyToQueue, Buffer.from(JSON.stringify(data)), {
      correlationId: correlationId,
    });
  }
}
