const {
  getUser,
  getUsers,
  createUser,
  checkUserLoggedIn,
} = require("./users.handlers");

const {
  createEmployee,
  getEmployee,
  getEmployes,
  checkEmployeeLoggedIn,
} = require("./employes.handlers");

const {
  hashPassword,
  verifyPassword,
  checkNotIncludeBadCharaters,
  checkAnyLoggedIn,
} = require("./common.handlers");

const { generateToken, verifyToken } = require("./token.handlers");

const {
  createBook,
  getBook,
  getBooks,
  increaseBookSales,
  getBooksByName,
} = require("./books.handlers");

const {
  getAllBookTransactions,
  getUserPurchasedBooks,
  purchasedBookTransaction,
} = require("./transaction.handlers");

module.exports = {
  // User
  getUser,
  getUsers,
  createUser,
  checkUserLoggedIn,
  // Common
  hashPassword,
  verifyPassword,
  checkNotIncludeBadCharaters,
  checkAnyLoggedIn,
  // Token
  generateToken,
  verifyToken,
  // Employee
  createEmployee,
  getEmployee,
  getEmployes,
  checkEmployeeLoggedIn,
  // Books
  createBook,
  getBook,
  getBooks,
  increaseBookSales,
  getBooksByName,
  // Transactions
  getAllBookTransactions,
  getUserPurchasedBooks,
  purchasedBookTransaction,
};
