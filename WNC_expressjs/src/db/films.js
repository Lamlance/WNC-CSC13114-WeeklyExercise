import { z } from "zod";
import { MysqlClient } from "./connect.js";

const FilmSchema = z.object({
  film_id: z.number(),
  title: z.string().max(255, "Film title has to be less than 255 characters"),
  description: z.string(),
  release_year: z.number().nullable(),
  language_id: z.number().min(0).max(255),
  original_language_id: z.number().min(0).max(255).nullable(),
  rental_duration: z.number().min(0).max(255),
  rental_rate: z.coerce.number(),
  length: z.number().nullable(),
  special_features: z
    .string()
    .nullable()
    .transform((data) => {
      if (!data) {
        return data;
      }
      const features = data.split(",");
      return z
        .array(
          z.union([
            z.literal("Trailers"),
            z.literal("Commentaries"),
            z.literal("Deleted Scenes"),
            z.literal("Behind the Scenes"),
          ])
        )
        .parse(features);
    }),
  replacement_cost: z.coerce.number(),
  rating: z.union([
    z.literal("G"),
    z.literal("PG"),
    z.literal("PG-13"),
    z.literal("R"),
    z.literal("NC-17"),
  ]),
  last_update: z.date(),
});

/**
 * @param {{skip:number,take:number}} arg0
 */
async function GetFilms({ skip, take }) {
  const data = await MysqlClient.from("film").limit(take).offset(skip);
  return z.array(FilmSchema).parse(data);
}

/**
 * @param {{id: number}} arg0
 */
async function GetFilmById({ id }) {
  console.log("get into film database");
  const data = await MysqlClient.from("film").where({ film_id: id }).first();

  if (!data) {
    return null;
  }

  const film = FilmSchema.parse(data);
  return film;
}

/**
 * @param {{id:number,info:object}} actorFilm
 * @returns {Promise<{msg:string}>}
 */
async function UpdateAFilm({ id, info }) {
  const res = await MysqlClient.from("film")
    .where({ film_id: id })
    .update(info);
  if (res > 0) {
    return { msg: `Film with ID ${id} has been updated successfully.` };
  } else {
    return { msg: `Film with ID ${id} not found .` };
  }
}

/**
 * @param { {id: number} } params
 * @returns { Promise<Void> }
 */
async function DeleteAFilm({ id }) {
  const res = await MysqlClient.from("film").where({ film_id: id }).del();

  if (res === 1) {
    return { msg: `Actor with ID ${id} has been deleted successfully.` };
  } else {
    return { msg: `Actor with ID ${id} not found or already deleted.` };
  }
}

/**
 * @param {Object} filmData
 * @returns {Promise<number>}
 */
async function CreateFilm(filmData) {
  try {
    const [insertedFilm] = await MysqlClient("film").insert(filmData);

    if (insertedFilm) {
      return insertedFilm;
    } else {
      throw new Error("Failed to create a new film.");
    }
  } catch (error) {
    throw new Error("Server error");
  }
}

export {
  GetFilms,
  GetFilmById,
  UpdateAFilm,
  DeleteAFilm,
  CreateFilm,
  FilmSchema,
};
