import { Router } from "express";
import jwt from "jsonwebtoken";
import { MysqlClient } from "../../src/db/connect.js";
import films_router from "../../src/routes/api/films.js";
const api_router = Router();
import crypto from "crypto";
import fetch from "node-fetch";
import {
  check_access_token,
  check_refresh_token_mw_builder,
  create_secrete_key,
  fetch_films_from_server_B,
  forward_server_B_data,
} from "../utils.js";

/**
 * @typedef {(req:import("express").Request,res:import("express").Response,next:import("express").NextFunction)=>any} express_middleware
 */

/**
 * @type {express_middleware}
 */
async function check_or_skip_refresh_token_builder(req, res, next) {
  if (res.locals.access_token !== "") {
    /** @type {express_middleware} */
    return function (req, res, next) {
      next();
    };
  }

  return check_refresh_token_mw_builder(res.header["refresh_token"]);
}

api_router.use(
  "/film",
  //check_access_token,
  //check_or_skip_refresh_token_builder(),
  async function (req, res, next) {
    const old_send = res.send;
    res.send = function (data) {
      const new_obj = {
        data: JSON.parse(data),
        token: res.locals.access_token,
      };
      arguments[0] = JSON.stringify(new_obj);
      old_send.apply(res, arguments);
    };
    next();
  },
  create_secrete_key,
  fetch_films_from_server_B,
  forward_server_B_data
);

export { api_router as api_router_v4_3 };
