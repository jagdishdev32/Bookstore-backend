const router = require("express").Router();
const db = require("../db");
const {
  createBook,
  checkNotIncludeBadCharaters,
  checkEmployeeLoggedIn,
  checkAnyLoggedIn,
  getBooks,
  getBooksByName,
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
  let { name, author, quantity, price } = req.body;

  const book = await createBook(name, author, quantity, price);

  return res.status(201).json({
    message: "Book Registered...",
    book: book,
  });
});

// METH		  GET	/books/search/:name
// DESC		  Get All Books by Name
// ACCESS	  PRIVATE (both user and employee)
router.get("/search/:name", checkAnyLoggedIn, async (req, res) => {
  const { name } = req.params;
  if (checkNotIncludeBadCharaters(name)) {
    const books = await getBooksByName(name);
    return res.status(200).json(books);
  }
  return res.status(400).json({ message: "bad Characters Included" });
});

module.exports = router;
