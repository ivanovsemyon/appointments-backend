const express = require("express");
const router = express.Router();

const {
  register,
  login,
  getAllAppointments,
  createAppointment,
} = require("../controllers/item.controller");

router.post("/register", register);
router.post("/login", login);
router.get("/general", getAllAppointments);
router.post("/createAppointment", createAppointment);
module.exports = router;
