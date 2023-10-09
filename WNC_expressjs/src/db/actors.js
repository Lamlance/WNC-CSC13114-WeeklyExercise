import { z } from "zod";
import { MysqlClient } from "../db/connect.js";
const ActorSchema = z.object({
  actor_id: z.number(),
  first_name: z.string(),
  last_name: z.string(),
  last_update: z.date(),
});
/**
 *  @typedef {z.infer<typeof ActorSchema>} Actor
 */
//Các hàm tương tác với db thì mn làm param 1 object
//Sau khi tương tác với db thì parse nó bằng zod
/**
 * @param { {skip:number,take:number} } params
 * @returns {Promise<Actor[]>}
 */
async function GetActors({ skip, take }) {
  const data = await MysqlClient.from("actor").limit(take).offset(skip);
  const result = z.array(ActorSchema).parse(data);
  return result;
}

async function GetActorById(id) {
  const actorData = await MysqlClient.from("actor")
    .where({ actor_id: id })
    .first();

  if (!actorData) {
    return { msg: `Actor ${id} not found` };
  }

  const actor = ActorSchema.parse(actorData);
  return actor;
}

export { GetActors, GetActorById };
