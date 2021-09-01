const express = require("express");
const router = express.Router();

const { register } = require("../controllers/item.controller");

router.post("/register", register);

module.exports = router;
