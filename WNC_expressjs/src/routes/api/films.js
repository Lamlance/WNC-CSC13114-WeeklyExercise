import express from "express";
import { CallAndCatchAsync } from "../../utils/utils.js";
import { z } from "zod";
import { GetFilms, DeleteAFilm } from "../../db/films.js";
const films_router = express.Router();
const FilmGetSchema = z.object({
  take: z.coerce.number().default(10),
  skip: z.coerce.number().default(0),
});

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
