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
  length: z.number(),
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

export { GetFilms };
