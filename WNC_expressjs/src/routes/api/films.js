import express from "express";
import { CallAndCatchAsync } from "../../utils/utils.js";
import { z } from "zod";

import { GetFilms, DeleteAFilm, UpdateAFilm } from "../../db/films.js";


const films_router = express.Router();
const FilmGetSchema = z.object({
  take: z.coerce.number().default(10),
  skip: z.coerce.number().default(0),
});


const FilmPutSchema = z
  .object({
    title: z.string(),
    description: z.string().optional(),
    release_year: z.number(),
    language_id: z.number(),
    length: z.number(),
    special_features: z.string().optional(),
    original_language_id: z.number(),
    rental_duration: z.number(),
    rental_rate: z.number(),
  })
  .partial()
  .refine(
    function ({ title, language_id }) {
      return !!title && !!language_id;
    },
    { message: "Value is required " }
  );


const FilmPatchSchema = z
  .object({
    title: z.string(),
    description: z.string().optional(),
    release_year: z.number(),
    language_id: z.number(),
    length: z.number(),
    special_features: z.string().optional(),
    original_language_id: z.number(),
    rental_duration: z.number(),
    rental_rate: z.number(),
  })
  .partial()
  .refine(
    function ({ title, language_id }) {
      return !!title && !!language_id;
    },
    { message: "Value is required " }
  );


films_router.get("/", async function (req, res) {
  const [queries, err1] = await CallAndCatchAsync(
    FilmGetSchema.parseAsync,
    req.query
  );
  if (err1 != null) {
    return res.status(400).json({ error: "Invalid queries" });
  }

  const [films, err2] = await CallAndCatchAsync(GetFilms, queries);
  if (err2 != null) {
    return res.status(500).json({ error: "Server error" });
  }
  return res.status(200).json(films);
});


films_router.put("/:id", async function (req, res) {
  const { id } = req.params;
  const [info, q_err] = await CallAndCatchAsync(
    FilmPutSchema.parseAsync,
    req.body
  );
  if (q_err != null) {
    return res.status(400).json({ error: "Invalid params" });
  }

  if (!id) {
    return res.status(400).json({ error: "Missing id!" });
  }

  const [data, err] = await CallAndCatchAsync(UpdateAFilm, { id, info });

  if (err) {
    return res.status(500).json({ msg: "Server error!", error: err });
  }

  return res.status(200).json(data);
});


films_router.patch("/:id", async function (req, res) {
  const { id } = req.params;
  const [info, q_err] = await CallAndCatchAsync(
    FilmPatchSchema.parseAsync,
    req.body
  );
  if (q_err != null) {
    return res.status(400).json({ error: "Invalid params" });
  }

  if (!id) {
    return res.status(400).json({ error: "Missing id!" });
  }

  const [data, err] = await CallAndCatchAsync(UpdateAFilm, { id, info });

  if (err) {
    return res.status(500).json({ msg: "Server error!", error: err });
  }

  return res.status(200).json(data);
});


films_router.delete("/:id", async function (req, res) {
  const { id } = req.params;
  console.log("id", id);

  if (!id) {
    return res.status(400).json({ error: "Missing id!" });
  }

  const [data, err] = await CallAndCatchAsync(DeleteAFilm, { id });

  if (err) {
    return res.status(500).json({ msg: "Server error!", error: err });
  }

  return res.status(200).json(data);
});

export default films_router;

export { FilmPutSchema, FilmPatchSchema };

