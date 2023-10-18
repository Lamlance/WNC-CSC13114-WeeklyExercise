import express from "express";
import { CallAndCatchAsync } from "../../utils/utils.js";
import { z } from "zod";
import {
  GetFilms,
  DeleteAFilm,
  UpdateAFilm,
  CreateFilm,
  FilmSchema,
  GetFilmById,
} from "../../db/films.js";

const films_router = express.Router();

const FilmGetSchema = z.object({
  take: z.coerce.number().default(10),
  skip: z.coerce.number().default(0),
});

const FilmCreateSchema = FilmSchema.omit({ film_id: true, last_update: true });

const FilmGetByIdSchema = z.object({
  id: z.coerce.number(),
});

const FilmPutSchema = FilmSchema.omit({ film_id: true, last_update: true });

const FilmPatchSchema = FilmPutSchema.partial().refine(
  function ({ title, language_id }) {
    return !!title && !!language_id;
  },
  { message: "Title & language id " }
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

films_router.post("/", async function (req, res) {
  let film = req.body;
  const [filmData, err] = await CallAndCatchAsync(
    FilmCreateSchema.parseAsync,
    film
  );
  if (err != null) {
    return res.status(400).json({ error: "Invalid data" });
  }

  const [data, creationErr] = await CallAndCatchAsync(CreateFilm, filmData);
  film = {
    film_id: data,
    ...film,
  };
  console.log(film);
  if (creationErr) {
    return res.status(500).json({ msg: "Server error", error: creationErr });
  }
  return res.status(201).json(film);
});

films_router.get("/:id", async function (req, res) {
  console.log("get into film id router");

  const { id } = FilmGetByIdSchema.parse(req.params);

  if (!id) {
    return res.status(400).json({ error: "Missing required parameter!" });
  }

  const [data, err] = await CallAndCatchAsync(GetFilmById, { id });

  if (err != null) {
    return res.status(500).json({ error: "Something went wrong!", error: err });
  }

  if (!data) {
    return res.status(404).json({ error: "Film not found!" });
  }

  return res.status(200).json({ data: data });
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

export { FilmPutSchema, FilmPatchSchema, FilmCreateSchema };
