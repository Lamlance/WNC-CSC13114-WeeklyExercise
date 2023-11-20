import RabbitMQConfig from "./config.js";

const rabbitMQConfig = new RabbitMQConfig();
// Open connection
await rabbitMQConfig.connect();

const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const queue = "order";

    // publish msg
    await rabbitMQConfig.createQueue(queue);
    await rabbitMQConfig.publishToQueue(queue, message);

    // // Close connection
    // await rabbitMQConfig.close();

    res.status(200).json({
      status: "Ok!",
      message: "Message successfully send!",
    });
  } catch (error) {
    console.log(error);
  }
};

const constrollers = { sendMessage };

export default constrollers;
