import request from "supertest";
import app from "../app";
import { BookDTO } from "../dto/book.dto";

describe("Books API", () => {
  /* GET @ /api/books/:id */
  it("should fail to get for a missing book ID", async () => {
    const missingId = "999";
    const response = await request(app).get(`/api/books/${missingId}`);
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("error");
  });

  /* POST @ /api/books */
  it("should fail to create a new book for missing field", async () => {
    const newBook = {
      title: "New Book",
      author: "Author",
      publishedYear: "2024",
      // genre: "Fiction",
    };

    const response = await request(app).post("/api/books").send(newBook);
    expect(response.status).toBe(400);

    // because return type of the error handler might be
    // an error or an array of errors
    const hasErrorProperty = response.body.hasOwnProperty("error");
    const hasErrorsArray = response.body.hasOwnProperty("errors");
    expect(hasErrorProperty || hasErrorsArray).toBe(true);
  });

  it("should fail to create a new book for unexpected field", async () => {
    const newBook = {
      title: "New Book",
      author: "Author",
      publishedYear: "2024",
      genre: "Fiction",
      shouldNotBeHere: "Hello!",
    };

    const response = await request(app).post("/api/books").send(newBook);
    expect(response.status).toBe(400);

    // because return type of the error handler might be
    // an error or an array of errors
    const hasErrorProperty = response.body.hasOwnProperty("error");
    const hasErrorsArray = response.body.hasOwnProperty("errors");
    expect(hasErrorProperty || hasErrorsArray).toBe(true);
  });

  it("should fail to create a new book with empty request body", async () => {
    const response = await request(app).post("/api/books").send({});
    expect(response.status).toBe(400);
    const hasErrorProperty = response.body.hasOwnProperty("error");
    const hasErrorsArray = response.body.hasOwnProperty("errors");
    expect(hasErrorProperty || hasErrorsArray).toBe(true);
  });

  it("should fail to create a new book with invalid data types", async () => {
    const newBook = {
      title: 12345, // should be string
      author: "Author",
      publishedYear: "2024",
      genre: "Fiction",
    };

    const response = await request(app).post("/api/books").send(newBook);
    expect(response.status).toBe(400);
    const hasErrorProperty = response.body.hasOwnProperty("error");
    const hasErrorsArray = response.body.hasOwnProperty("errors");
    expect(hasErrorProperty || hasErrorsArray).toBe(true);
  });

  /* PUT @ /api/books/:id */
  it("should fail to update for a missing book ID", async () => {
    const updatedBook = {
      title: "Updated Book",
      author: "Updated Author",
      publishedYear: "2024",
      genre: "Fiction",
    };

    const response = await request(app).put("/api/books/999").send(updatedBook);
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("error");
  });

  it("should fail to update for a missing field", async () => {
    const updatedBook = {
      title: "Updated Book",
      author: "Updated Author",
      publishedYear: "2024",
      // genre: "Fiction",
    };

    const response = await request(app).put("/api/books/1").send(updatedBook);
    expect(response.status).toBe(400);
    const hasErrorProperty = response.body.hasOwnProperty("error");
    const hasErrorsArray = response.body.hasOwnProperty("errors");
    expect(hasErrorProperty || hasErrorsArray).toBe(true);
  });

  it("should fail to update for an unexpected field", async () => {
    const updatedBook = {
      title: "Updated Book",
      author: "Updated Author",
      publishedYear: "2024",
      genre: "Fiction",
      shouldNotBeHere: "Hello!",
    };

    const response = await request(app).put("/api/books/1").send(updatedBook);
    expect(response.status).toBe(400);
    const hasErrorProperty = response.body.hasOwnProperty("error");
    const hasErrorsArray = response.body.hasOwnProperty("errors");
    expect(hasErrorProperty || hasErrorsArray).toBe(true);
  });

  it("should fail to update a book with empty request body", async () => {
    const response = await request(app).put("/api/books/1").send({});
    expect(response.status).toBe(400);
    const hasErrorProperty = response.body.hasOwnProperty("error");
    const hasErrorsArray = response.body.hasOwnProperty("errors");
    expect(hasErrorProperty || hasErrorsArray).toBe(true);
  });

  it("should fail to update a new book with invalid data types", async () => {
    const newBook = {
      title: 12345, // should be string
      author: "Author",
      publishedYear: "2024",
      genre: "Fiction",
    };

    const response = await request(app).put("/api/books/1").send(newBook);
    expect(response.status).toBe(400);
    const hasErrorProperty = response.body.hasOwnProperty("error");
    const hasErrorsArray = response.body.hasOwnProperty("errors");
    expect(hasErrorProperty || hasErrorsArray).toBe(true);
  });

  /* DELETE @ /api/books/:id */
  it("should fail to delete for a missing book ID", async () => {
    const response = await request(app).delete("/api/books/999");
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("error");
  });
});
