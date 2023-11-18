import RabbitMQConfig from "./config.js";

const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const queue = "order";

    const rabbitMQConfig = new RabbitMQConfig();

    // Open connection
    await rabbitMQConfig.connect();

    // publish msg
    await rabbitMQConfig.createQueue(queue);
    await rabbitMQConfig.publishToQueue(queue, message);

    // Close connection
    await rabbitMQConfig.close();

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
