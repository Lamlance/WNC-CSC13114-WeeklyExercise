import { randomUUID } from "crypto";

const rpcQueueName = "rpc_queue_rr";
export default class Producer {
  constructor(channel, replyQueueName, eventEmitter) {
    this.channel = channel;
    this.replyQueueName = replyQueueName;
    this.eventEmitter = eventEmitter;
  }

  async produceMessages(data) {
    const uuid = randomUUID();
    console.log("the corr id is ", uuid);
    this.channel.sendToQueue(rpcQueueName, Buffer.from(JSON.stringify(data)), {
      replyTo: this.replyQueueName,
      correlationId: uuid,
      expiration: 10,
    });

    return new Promise((resolve, reject) => {
      this.eventEmitter.once(uuid, async (data) => {
        const reply = JSON.parse(data.content.toString());

        resolve(reply);
      });
    });
  }
}
