import express from "express";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
const apidoc_routes = express.Router();
import { zodToJsonSchema } from "zod-to-json-schema";
import { ActorSchema } from "../db/actors.js";
import { FilmSchema } from "../db/films.js";
import APIPath from "./api/api_path.json" assert { type: "json" };

import { ActorCreateSchema, ActorPutSchema, ActorPatchSchema } from "./api/actors.js";
import { FilmPutSchema, FilmPatchSchema } from "./api/films.js";


const jsonSchema = {
  openapi: "3.1.0",
  components: {
    schemas: {
      Actor: zodToJsonSchema(ActorSchema, {
        target: "openApi3",
      }),
      ActorCreateBody: {
        ...zodToJsonSchema(ActorCreateSchema, {
          target: "openApi3",
        }),
        example: {
          first_name: "Hoang",
          last_name: "Lam",
        },
      },

      ActorUpdateBody: {
        ...zodToJsonSchema(ActorPutSchema, {
          target: "openApi3",
        }),
        example: {
          first_name: "Van",
          last_name: "Duc",
        },
      },
      ActorUpdateBody4Patch: {
        ...zodToJsonSchema(ActorPatchSchema, {
          target: "openApi3",
        }),
        example: {
          first_name: "Duy",
          last_name: "Anh",
        },
      },
      Film: zodToJsonSchema(FilmSchema, {
        target: "openApi3",
      }),
      FilmUpdateBody: {
        ...zodToJsonSchema(FilmPutSchema, {
          target: "openApi3",
        }),
        example: {
          title: "Adventure",
          language_id: 1,
        },
      },
      FilmUpdateBody4Patch: {
        ...zodToJsonSchema(FilmPatchSchema, {
          target: "openApi3",
        }),
        example: {
          title: "ANGELS LIFE",
          language_id: 1,
        },
      },

      Error: {
        type: "object",
        properties: {
          error: { type: "string" },
        },
      },
      SimpleResponse: {
        type: "object",
        properties: {
          msg: { type: "string" },
        },
      },
      DetailErrorResponse: {
        type: "object",
        properties: {
          msg: { type: "string" },
          err: { type: "object" },
        },
      },
    },
    responses: {
      "400InvalidInput": {
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/Error",
            },
          },
        },
      },
      "500ServerError": {
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/Error",
            },
          },
        },
      },
      "500DetailServerError": {
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/DetailErrorResponse",
            },
          },
        },

      },

      }

    },
  // },
};
const options = {
  definition: {
    openapi: "3.1.0",
    info: {
      title: "Express REST APIs",
      version: "0.1.0",
      description: "Advance web REST APIs",
      license: {
        name: "MIT",
        url: "https://spdx.org/licenses/MIT.html",
      },
    },
    servers: [
      {
        url: "http://localhost:3085/api",
      },
    ],
    ...jsonSchema,
    paths: {
      ...APIPath,
    },
  },
  apis: ["./src/routes/api/*.js"],
};

const specs = swaggerJsdoc(options);
apidoc_routes.use("/", swaggerUi.serve);
apidoc_routes.get("/", swaggerUi.setup(specs));

export default apidoc_routes;
