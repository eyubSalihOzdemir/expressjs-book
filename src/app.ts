import express, { Request, Response, NextFunction } from "express";
import booksRouter from "./routes/books";
import indexRouter from "./routes";

const app = express();

// middleware to parse JSON bodies
app.use(express.json());

app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
  // Request methods you wish to allow
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", "false");

  // Pass to next layer of middleware
  next();
});

app.use("/api", indexRouter);
app.use("/api/books", booksRouter);

// middleware to handle errors
app.use(
  (err: Error | Error[], req: Request, res: Response, next: NextFunction) => {
    const status = Array.isArray(err) ? 400 : (err as any).status || 500;

    if (Array.isArray(err)) {
      const errorResponse = err.map((error) => ({
        message: error.message,
        statusCode: (error as any).statusCode || 400,
        ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
      }));

      res.status(status).json({ errors: errorResponse });
    } else {
      // For a single error
      const errorResponse = {
        message: err.message,
        statusCode: status,
        ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
      };

      res.status(status).json({ error: errorResponse });
    }
  }
);

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

export default app;
