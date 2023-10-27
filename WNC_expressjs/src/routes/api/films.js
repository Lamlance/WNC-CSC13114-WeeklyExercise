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
import {
  validation_mw_builder_body,
  validation_mw_builder_params,
  validation_mw_builder_queries,
} from "../../utils/ValidationMiddlewareBuilder.js";

const films_router = express.Router();

const FilmGetSchema = z.object({
  take: z.coerce.number().default(10),
  skip: z.coerce.number().default(0),
});

const FilmCreateSchema = FilmSchema.omit({ film_id: true, last_update: true })
  .partial()
  .refine(
    function ({ title, language_id, description }) {
      return !!title && !!language_id && !!description;
    },
    { message: "At least need title, description and language_id" }
  );

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

films_router.get(
  "/",
  validation_mw_builder_queries(FilmGetSchema),
  async function (req, res, next) {
    const [films, err2] = await CallAndCatchAsync(GetFilms, res.locals.query);
    if (err2 != null) {
      return next(err2);
    }
    return res.status(200).json(films);
  }
);

films_router.post(
  "/",
  validation_mw_builder_body(FilmCreateSchema),
  async function (req, res, next) {
    const [data, creationErr] = await CallAndCatchAsync(
      CreateFilm,
      res.locals.body
    );
    const film = {
      film_id: data,
      ...res.locals.body,
    };
    console.log(film);
    if (creationErr) {
      return res.status(500).json({ msg: "Server error", error: creationErr });
    }
    return res.status(201).json(film);
  }
);

films_router.get(
  "/:id",
  validation_mw_builder_params(FilmGetByIdSchema),
  async function (req, res, next) {
    const [data, err] = await CallAndCatchAsync(GetFilmById, res.locals.params);

    if (err != null) {
      return res
        .status(500)
        .json({ error: "Something went wrong!", error: err });
    }

    if (!data) {
      return res.status(404).json({ error: "Film not found!" });
    }

    return res.status(200).json({ data: data });
  }
);

films_router.put(
  "/:id",
  validation_mw_builder_params(FilmGetByIdSchema),
  validation_mw_builder_body(FilmPutSchema),
  async function (req, res, next) {
    const [data, err] = await CallAndCatchAsync(UpdateAFilm, {
      id: res.locals.params.id,
      info: res.locals.body,
    });

    if (err) {
      return res.status(500).json({ msg: "Server error!", error: err });
    }

    return res.status(200).json(data);
  }
);

films_router.patch(
  "/:id",
  validation_mw_builder_params(FilmGetByIdSchema),
  validation_mw_builder_body(FilmPatchSchema),
  async function (req, res, next) {
    const [data, err] = await CallAndCatchAsync(UpdateAFilm, {
      id: res.locals.params.id,
      info: res.locals.body,
    });

    if (err) {
      return res.status(500).json({ msg: "Server error!", error: err });
    }

    return res.status(200).json(data);
  }
);

films_router.delete(
  "/:id",
  validation_mw_builder_params(FilmGetByIdSchema),
  async function (req, res, next) {
    const [data, err] = await CallAndCatchAsync(DeleteAFilm, {
      id: res.locals.id,
    });

    if (err) {
      return res.status(500).json({ msg: "Server error!", error: err });
    }

    return res.status(200).json(data);
  }
);

export default films_router;

export { FilmPutSchema, FilmPatchSchema, FilmCreateSchema };
