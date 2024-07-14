import express, { Request, Response, NextFunction } from "express";
import books, {
  addBook,
  getBookById,
  validateRequestAgainstDTO,
} from "../public/books";
import { BookDTO, CreateBookDTO } from "../dto/book.dto";
import { plainToClass } from "class-transformer";

const booksRouter = express.Router();

/* GET books listing. */
booksRouter.get("/", (req: Request, res: Response) => {
  res.json(books);
});

/* GET a single book listing. */
booksRouter.get(
  "/:id",
  function (req: Request, res: Response, next: NextFunction) {
    try {
      const book = getBookById(req.params.id);
      res.json(book);
    } catch (err) {
      next(err);
    }
  }
);

/* POST to books listing. */
booksRouter.post(
  "/",
  async function (req: Request, res: Response, next: NextFunction) {
    try {
      const newBookDTO = plainToClass(CreateBookDTO, req.body, {
        excludeExtraneousValues: true,
      });

      var validationErrors = await validateRequestAgainstDTO(req, newBookDTO);
      if (validationErrors.length > 0) {
        console.log("Validation error on POST method");
        return next(validationErrors);
      }

      // validation successful, add the book and return the result
      let addedBookWithID = addBook(newBookDTO);
      res.status(201).json(addedBookWithID);
    } catch (error) {
      // forward any unrelated errors to errors handling middleware
      console.log("Unknown error on POST method");
      next(error);
    }
  }
);

/* PUT to books listing to edit. */
booksRouter.put(
  "/:id",
  async function (req: Request, res: Response, next: NextFunction) {
    try {
      // creata a new book and assign the incoming body to it for validation
      const newBookDTO = plainToClass(CreateBookDTO, req.body, {
        excludeExtraneousValues: true,
      });

      var validationErrors = await validateRequestAgainstDTO(req, newBookDTO);
      if (validationErrors.length > 0) {
        console.log("Validation error on PUT method");
        return next(validationErrors);
      }

      // check the index and see if the book exists, return error otherwise
      const index = books.findIndex((book) => book.id === req.params.id);
      if (index === -1) {
        const err = new Error(`Book with ID:${req.params.id} not found`);
        (err as any).status = 404;
        return next(err);
      }

      // assign the id to dto object and register the book to correct index
      const updatedBookDTO = plainToClass(BookDTO, newBookDTO);
      updatedBookDTO.id = req.params.id;
      books[index] = updatedBookDTO;

      res.status(200).json(updatedBookDTO);
    } catch (error) {
      next(error);
    }
  }
);

/* DELETE on books listing. */
booksRouter.delete(
  "/:id",
  function (req: Request, res: Response, next: NextFunction) {
    try {
      const bookID = req.params.id;
      const index = books.findIndex((book) => book.id === bookID);

      if (index === -1) {
        const err = new Error(`Book with ID:${bookID} not found`);
        (err as any).status = 404;
        next(err);
      } else {
        // remove the book from the array
        const removedBook = books.splice(index, 1)[0];
        res.status(200).json(removedBook);
      }
    } catch (error) {
      next(error);
    }
  }
);

export default booksRouter;
