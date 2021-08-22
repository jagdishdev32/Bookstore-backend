const express = require('express');

// Enabling Environment Variables from .env file
require('dotenv').config()

const app = express();

// Enabling Json Parse Support
app.use(express.json())
app.use(express.urlencoded({extended: false}))

app.get("/", (req, res) => {
	return res.status(200).json({message: "welcome to home page!"})
});

module.exports = app;
