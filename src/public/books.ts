// import { Book } from "./types";
import { validate } from "class-validator";
import { BookDTO, CreateBookDTO } from "../dto/book.dto";
import { Request } from "express";

const books: BookDTO[] = [
  {
    id: "1",
    title: "Foundation",
    author: "Isaac Asimov",
    publishedYear: "1951",
    genre: "Science Fiction",
  },
  {
    id: "2",
    title: "I, Robot",
    author: "Isaac Asimov",
    publishedYear: "1950",
    genre: "Science Fiction",
  },
  {
    id: "3",
    title: "The Gods Themselves",
    author: "Isaac Asimov",
    publishedYear: "1972",
    genre: "Science Fiction",
  },
  {
    id: "4",
    title: "The Caves of Steel",
    author: "Isaac Asimov",
    publishedYear: "1954",
    genre: "Science Fiction",
  },
  {
    id: "5",
    title: "Dune",
    author: "Frank Herbert",
    publishedYear: "1965",
    genre: "Science Fiction",
  },
  {
    id: "6",
    title: "Neuromancer",
    author: "William Gibson",
    publishedYear: "1984",
    genre: "Science Fiction",
  },
  {
    id: "7",
    title: "Snow Crash",
    author: "Neal Stephenson",
    publishedYear: "1992",
    genre: "Science Fiction",
  },
  {
    id: "8",
    title: "Brave New World",
    author: "Aldous Huxley",
    publishedYear: "1932",
    genre: "Dystopian",
  },
  {
    id: "9",
    title: "1984",
    author: "George Orwell",
    publishedYear: "1949",
    genre: "Dystopian",
  },
  {
    id: "10",
    title: "Fahrenheit 451",
    author: "Ray Bradbury",
    publishedYear: "1953",
    genre: "Dystopian",
  },
];

export function addBook(newBook: Omit<BookDTO, "id">): BookDTO {
  let lastID =
    books.length > 0
      ? Math.max(...books.map((book) => parseInt(book.id))) + 1
      : 1;
  const book: BookDTO = {
    id: lastID.toString(),
    ...newBook,
  };
  books.push(book);
  return book;
}

export async function validateRequestAgainstDTO(
  req: Request,
  bookDTO: CreateBookDTO
): Promise<Error[]> {
  // ): Promise<Error | null> {
  const errorsArray: Error[] = [];

  const dtoProperties = Object.keys(bookDTO);
  const requestProperties = Object.keys(req.body);

  // check against unexpected fields
  for (const prop of requestProperties) {
    // console.log(`${dtoProperties.includes(prop)}`);
    if (!dtoProperties.includes(prop)) {
      // const err = new Error(`Unexpected field: ${prop}`);
      // return err;
      const newError = new Error();
      newError.name = "Bad Request";
      newError.message = `Unexpected field: ${prop}`;
      (newError as any).status = 400;
      errorsArray.push(newError);
      // return newError;
    }
  }

  // create an object to validate the missing fields if any
  let errors = await validate(bookDTO);
  if (errors.length > 0) {
    // collect all the errors and return them
    errors.map((err) => {
      // field: err.property,
      // message: Object.values(err.constraints!)[0],
      const newError = new Error();
      newError.name = "Bad Request";
      newError.message = `${err.property}: ${
        Object.values(err.constraints!)[0]
      }`;
      errorsArray.push(newError);
    });
    // return errorsArray;
  }

  (errorsArray as any).status = 400;
  return errorsArray;
  // return null;
}

// shared function for fetching a book by ID
export const getBookById = (bookId: string) => {
  const book = books.find((book) => book.id === bookId);
  if (!book) {
    const err = new Error(`Book with ID:${bookId} not found`);
    (err as any).status = 404;
    throw err;
  }
  return book;
};

export default books;
