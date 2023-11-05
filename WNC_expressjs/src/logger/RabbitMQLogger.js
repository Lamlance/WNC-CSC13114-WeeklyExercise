import Transport from "winston-transport";
import amqp from "amqplib/callback_api.js";

/**
 * @class
 * @extends Transport
 */
class RabbitMQLogger extends Transport {
  /**
   * @type {amqp.Channel | null}
   */
  rabbitmq_channel = null;
  /**
   * @param {Transport.TransportStreamOptions | undefined} opts
   */
  constructor(opts) {
    super(opts);
    this.rabbitmq_ch_callback = this.rabbitmq_ch_callback.bind(this);
    const rabbitmq_ch_callback = this.rabbitmq_ch_callback;

    amqp.connect("amqp://guest:guest@localhost:8672", function (err, conn) {
      conn.createChannel(rabbitmq_ch_callback);
    });
  }

  /**
   * @param {any} err
   * @param {amqp.Channel} ch
   */
  rabbitmq_ch_callback(err, ch) {
    this.rabbitmq_channel = ch;
    ch.assertQueue("log-messages", { durable: true });
  }

  log(info, callback) {
    setImmediate(() => {
      this.emit("logged", info);
    });
    if (typeof info === "object") {
      this.rabbitmq_channel.sendToQueue(
        "log-messages",
        Buffer.from(JSON.stringify(info))
      );
    } else if (typeof info === "string") {
      this.rabbitmq_channel.sendToQueue("log-messages", Buffer.from(info));
    }
    callback();
  }
}
export default RabbitMQLogger;
