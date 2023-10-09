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

/**
 * @param { id:number } params
 * @returns {Promise<Actor>}
 */
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


/**
 * @param { {id: number} } params
 * @returns { Promise<Void> }
 */
async function DeleteAnActor({ id }) {
  const res1 = await MysqlClient.from("film_actor")
    .where({ actor_id: id })
    .del();

  const res = await MysqlClient.from("actor").where({ actor_id: id }).del();

  if (res === 1) {
    return { msg: `Actor with ID ${id} has been deleted successfully.` };
  } else {
    return { msg: `Actor with ID ${id} not found or already deleted.` };
  }
}

async function UpdateAnActor({ id, info }) {
  const { first_name, last_name } = info;
  const formattedDateTime = new Date()
    .toISOString()
    .slice(0, 19)
    .replace("T", " ");
  const res = await MysqlClient.from("actor")
    .where({ actor_id: id })
    .update({ first_name, last_name, last_update: formattedDateTime });
  if (res > 0) {
    return { msg: `Actor with ID ${id} has been updated successfully.` };
  } else {
    return { msg: `Actor with ID ${id} not found .` };
  }
}

/**
 * @param {Object} actorData
 * @returns {Promise<number>}
 */
async function AddActor(actorData) {
  try {
    const [insertedActorId] = await MysqlClient("actor").insert(actorData);

    if (insertedActorId) {
      return insertedActorId;
    } else {
      throw new Error("Failed to add actor");
    }
  } catch (error) {
    console.error(error);
    throw new Error("Server error");
  }
}

export { GetActors, GetActorById, DeleteAnActor, UpdateAnActor, AddActor };

