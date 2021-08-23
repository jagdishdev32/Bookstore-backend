const router = require("express").Router();
const db = require("../db");
const {
  createBook,
  checkNotIncludeBadCharaters,
  verifyPassword,
  generateToken,
  checkEmployeeLoggedIn,
  checkUserLoggedIn,
  checkAnyLoggedIn,
  getBooks,
} = require("../handlers");

// METH		  GET	/books/
// DESC		  Get All Books
// ACCESS	  PRIVATE (both user and employee)
router.get("/", checkAnyLoggedIn, async (req, res) => {
  const books = await getBooks();
  return res.status(200).json(books);
});

// METH		  POST /books/
// DESC		  Add new book
// ACCESS 	PRIVATE (employee only)
router.post("/", checkEmployeeLoggedIn, async (req, res) => {
  let { name, author, quantity } = req.body;

  const book = await createBook(name, author, quantity);

  return res.status(201).json({
    message: "Book Registered...",
    book: book,
  });
});

module.exports = router;
