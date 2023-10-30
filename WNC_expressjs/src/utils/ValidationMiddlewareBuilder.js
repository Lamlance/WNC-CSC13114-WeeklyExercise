import { ZodType } from "zod";
import express from "express";

/**
 * @param {ZodType} zodSchema
 * @returns {(req:express.Request,res:express.Response,next:express.NextFunction)=>any}
 */
function validation_mw_builder_queries(zodSchema) {
  return function (req, res, next) {
    const data = zodSchema.safeParse(req.query);
    if (!data.success) {
      return res.status(400).json({
        message: "Invalid queries",
        error: data.error.errors.map((e) => e.message),
      });
    }
    res.locals.query = data.data;
    next();
  };
}

/**
 * @param {ZodType} zodSchema
 * @returns {(req:express.Request,res:express.Response,next:express.NextFunction)=>any}
 */
function validation_mw_builder_params(zodSchema) {
  return function (req, res, next) {
    const data = zodSchema.safeParse(req.params);
    if (!data.success) {
      return res.status(400).json({
        message: "Invalid params",
        error: data.error.errors.map((e) => e.message),
      });
    }
    res.locals.params = data.data;
    next();
  };
}

/**
 * @param {ZodType} zodSchema
 * @returns {(req:express.Request,res:express.Response,next:express.NextFunction)=>any}
 */
function validation_mw_builder_body(zodSchema) {
  return function (req, res, next) {
    const data = zodSchema.safeParse(req.body);
    if (!data.success) {
      return res
        .status(400)
        .json({
          message: "Invalid body",
          error: data.error.errors.map((e) => e.message),
        });
    }
    res.locals.body = data.data;
    next();
  };
}

export {
  validation_mw_builder_queries,
  validation_mw_builder_params,
  validation_mw_builder_body,
};
