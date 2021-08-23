const router = require("express").Router();
const {
  checkEmployeeLoggedIn,
  checkAnyLoggedIn,
  checkUserLoggedIn,
  getBook,
  purchasedBookTransaction,
  getUserPurchasedBooks,
  getAllBookTransactions,
} = require("../handlers");

// METH		  GET	/transactions
// DESC		  Get all Transactions
// ACCESS	  PRIVATE (employee only)
router.get("/", checkEmployeeLoggedIn, async (req, res) => {
  const transactions = await getAllBookTransactions();
  return res.status(200).json(transactions);
});

// METH		  GET /transactions/purchase
// DESC		  Get all transactions by user
// ACCESS	  PRIVATE (both employee & user)
router.get("/purchase", checkAnyLoggedIn, async (req, res) => {
  let user_id;
  // Checking if User is request route
  if (req.user_id) {
    user_id = req.user_id;
  } else {
    // For Employe must pass user id in body
    if (req.body.user_id) {
      user_id = req.body.user_id;
    } else {
      return res.status(400).json({ message: "no user_id" });
    }
  }

  const user_transactions = await getUserPurchasedBooks(user_id);
  return res.json(user_transactions);
});

// METH		  POST	/transactions/purchase
// DESC		  Purchase Book
// ACCESS	  PRIVATE (user only)
router.post("/purchase/:book_id", checkUserLoggedIn, async (req, res) => {
  const { book_id } = req.params;
  const user_id = req.user_id;

  // If no purchase quentity is specified then default is 1
  const quantity = req.body.quantity || 1;

  const book = await getBook(book_id);

  if (book) {
    const transactionData = await purchasedBookTransaction(
      book.id,
      user_id,
      quantity
    );

    return res.status(201).json(transactionData);
  }

  return res.status(400).json({ message: "Invalid book_id" });
});

module.exports = router;
