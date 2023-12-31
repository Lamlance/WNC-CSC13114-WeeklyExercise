import UDP from "dgram";
import Transport from "winston-transport";
class UDPSocketLogger extends Transport {
  udp_client = UDP.createSocket("udp4");
  port = 0;
  /**
   *
   * @param {Transport.TransportStreamOptions | undefined} opts
   * @param {number} port
   */
  constructor(opts, port) {
    super(opts);
    this.port = port;
    this.udp_client.addListener("connect", () => console.log("UDP Connect"));
    this.udp_client.addListener("error", (err) => console.log(err));
    this.udp_client.addListener("message", () => console.log("UDP message"));
  }

  log(info, callback) {
    setImmediate(() => {
      this.emit("logged", info);
    });
    let message = "";
    if (typeof info === "object") {
      message = JSON.stringify(info);
    } else if (typeof info === "string") {
      message = info;
    }

    this.udp_client.send(
      Buffer.from(message),
      this.port,
      "localhost",
      function (err, b) {
        console.log(err, b);
      }
    );

    callback();
  }
}

export default UDPSocketLogger;
