const db = require("../db");

module.exports = {
  getBooks: async () => {
    const data = await db.query("SELECT * FROM books");
    const books = data.rows;

    return books;
  },
  getBook: async (id) => {
    const data = await db.query("SELECT * FROM books WHERE id=$1", [id]);
    const book = data.rows[0];

    return book;
  },
  createBook: async (name, author, quantity, price) => {
    const data = await db.query(
      "INSERT INTO books (name, author, quantity, price) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, author, quantity, price]
    );
    const book = data.rows[0];
    return book;
  },
  //   Increasing Old Sales No. by 1
  increaseBookSales: async (id) => {
    const currentBook = await getBook(id);

    if (currentBook) {
      const oldSalesValue = currentBook.sales;
      const data = await db.query(
        "UPDATE books SET sales=$1 WHERE id=$1 RETURNING *",
        [oldSalesValue + 1]
      );
      return { message: "SalesUpdated", book: data.rows[0] };
    }

    return { message: "No Book With this Id" };
  },
  getBooksByName: async (name) => {
    const data = await db.query(
      `SELECT * FROM books WHERE name ILIKE '%${name}%'`
    );
    return data.rows;
  },
};
