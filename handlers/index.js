const { getUser, getUsers, createUser } = require("./users.handlers");

const {
  createEmployee,
  getEmployee,
  getEmployes,
} = require("./employes.handlers");

const {
  hashPassword,
  verifyPassword,
  checkNotIncludeBadCharaters,
} = require("./common.handlers");

const { generateToken } = require("./token.handlers");

module.exports = {
  // User
  getUser,
  getUsers,
  createUser,
  // Common
  hashPassword,
  verifyPassword,
  checkNotIncludeBadCharaters,
  // Token
  generateToken,
  // Employee
  createEmployee,
  getEmployee,
  getEmployes,
};
