const db = require("../db");
const { getBook, increaseBookSales } = require("./books.handlers");

module.exports = {
  purchasedBookTransaction: async (book_id, user_id, quantity = 1) => {
    const book = await getBook(book_id);
    if (book) {
      const transaction = await db.query(
        "INSERT INTO book_transactions (book_id, user_id, quantity) VALUES ($1, $2, $3) RETURNING *",
        [book_id, user_id, quantity]
      );

      const increasedSales = await increaseBookSales(book_id, quantity);
      if ((increasedSales.message = "sales updated")) {
        return {
          message: "transaction & sales update complete",
          transaction: transaction.rows[0],
        };
      }
      return { message: increasedSales.message };
    }
    return { message: "Invalid book id" };
  },
  getAllBookTransactions: async () => {
    const books = await db.query("SELECT * FROM book_transactions");
    return books.rows;
  },
  getUserPurchasedBooks: async (user_id) => {
    try {
      const data = await db.query(
        `
          SELECT 
          books.name, 
          books.author , 
          book_transactions.id AS transaction_id, 
          book_transactions.transaction_date AS transaction_date, 
          book_transactions.quantity, 
          books.price, 
          books.price 
          FROM books 
          INNER JOIN book_transactions 
          ON books.id = book_transactions.book_id 
          WHERE book_transactions.user_id = $1
          `,
        [user_id]
      );
      return data.rows;
    } catch (error) {
      return error.message;
    }
  },
};
