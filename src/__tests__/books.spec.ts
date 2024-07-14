import request from "supertest";
import app from "../app";
import { BookDTO } from "../dto/book.dto";

describe("Books API", () => {
  /* GET @ /api/books */
  it("should get all books", async () => {
    const response = await request(app).get("/api/books");
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array<BookDTO>);
  });

  /* GET @ /api/books/:id */
  it("should get a book by ID in range", async () => {
    const response = await request(app).get("/api/books/1");
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      id: "1",
      title: expect.any(String),
      author: expect.any(String),
      publishedYear: expect.any(String),
      genre: expect.any(String),
    });
  });

  /* POST @ /api/books */
  it("should create a new book", async () => {
    const newBook = {
      title: "New Book",
      author: "Author",
      publishedYear: "2024",
      genre: "Fiction",
    };

    const response = await request(app).post("/api/books").send(newBook);
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body).toMatchObject(newBook);
  });

  /* PUT @ /api/books/:id */
  it("should update a book by ID", async () => {
    const updatedBook = {
      title: "Updated Book",
      author: "Updated Author",
      publishedYear: "2024",
      genre: "Fiction",
    };

    const response = await request(app).put("/api/books/1").send(updatedBook);
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject(updatedBook);
  });

  /* DELETE @ /api/books/:id */
  it("should delete a book by ID", async () => {
    const response = await request(app).delete("/api/books/1");
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id", "1");
  });
});
