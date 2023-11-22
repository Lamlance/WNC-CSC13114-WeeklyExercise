import rabbitClient from "./client.js";
import { GetActors } from "../../../src/db/actors.js";

const getAllActors = async () => {
  try {
    const actors = await GetActors({ skip: 0, take: 10 });
    return actors;
  } catch (err) {
    return { msg: "Error when get actors" };
  }
};
export default class MessageHandler {
  static async handle(data, correlationId, replyTo) {
    if (data == "actors") {
      console.log(" [.] Resolving request...");
      const response = await getAllActors();

      //Produce the response back to the client
      await rabbitClient.produce(response, correlationId, replyTo);
    }
  }
}
