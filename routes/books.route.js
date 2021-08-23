const router = require("express").Router();
const db = require("../db");
const {
  createBook,
  checkNotIncludeBadCharaters,
  checkEmployeeLoggedIn,
  checkAnyLoggedIn,
  getBooks,
  getBooksByName,
  updateBook,
  deleteBook,
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

// METH		  POST	/books/:id
// DESC		  Update Book data
// ACCESS	  PRIVATE (employee only)
router.post("/:id", checkEmployeeLoggedIn, async (req, res) => {
  const { id } = req.params;
  const { name, author, quantity, price } = req.body;

  const book = await updateBook(id, name, author, quantity, price);
  return res.status(201).json({ message: "updated..", book });
});

router.delete("/:id", checkEmployeeLoggedIn, async (req, res) => {
  const { id } = req.params;
  const book = await deleteBook(id);
  return res.status(200).json({ message: "deleted", book: book });
});

module.exports = router;
