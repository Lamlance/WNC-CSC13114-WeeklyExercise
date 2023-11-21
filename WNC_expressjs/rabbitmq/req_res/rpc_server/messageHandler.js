import rabbitClient from "./client.js";
import { AddActor } from "../../../src/db/actors.js";
import { CallAndCatchAsync } from "../../../src/utils/utils.js";
import { ActorCreateSchema } from "../../../src/routes/api/actors.js";
export default class MessageHandler {
  static async handle(data, correlationId, replyTo) {
    const { first_name, last_name } = data;
    let actor = data;

    const [validatedData, validationError] = await CallAndCatchAsync(
      ActorCreateSchema.parseAsync,
      actor
    );

    if (validationError) {
      return res.status(400).json({ error: "Invalid request body" });
    }

    const [response, error] = await CallAndCatchAsync(AddActor, validatedData);

    actor = {
      actor_id: response,
      ...actor,
    };

    //Produce the response back to the client
    await rabbitClient.produce(response, correlationId, replyTo);
  }
}
