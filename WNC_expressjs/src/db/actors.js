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
 * @param { {id:number} } params
 * @returns {Promise<Actor | {msg:string}>}
 */
async function GetActorById({ id }) {
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

/**
 * @param {{id:number,info:{last_name:string,first_name:string}}} actorData
 * @returns {Promise<{msg:string}>}
 */
async function UpdateAnActor({ id, info }) {
  const { first_name, last_name } = info;
  const res = await MysqlClient.from("actor")
    .where({ actor_id: id })
    .update({ first_name, last_name });
  if (res > 0) {
    return { msg: `Actor with ID ${id} has been updated successfully.` };
  } else {
    return { msg: `Actor with ID ${id} not found .` };
  }
}

/**
 * @param {{last_name:string,first_name:string}} actorData
 * @returns {Promise<number>}
 */
async function AddActor({ first_name, last_name }) {
  try {
    const [insertedActorId] = await MysqlClient("actor").insert({
      first_name,
      last_name,
    });

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

export {
  GetActors,
  GetActorById,
  DeleteAnActor,
  UpdateAnActor,
  AddActor,
  ActorSchema,
};
