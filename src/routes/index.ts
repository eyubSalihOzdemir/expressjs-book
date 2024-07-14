// var express = require("express");
import express, { Request, Response, NextFunction } from "express";

const indexRouter = express.Router();

indexRouter.get("/", (req: Request, res: Response) => {
  res.json({ message: "Server is alive!" });
});

export default indexRouter;
