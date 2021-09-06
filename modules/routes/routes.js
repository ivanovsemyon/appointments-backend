const express = require("express");
const router = express.Router();

const {
  verifyToken,
  register,
  login,
  getAllAppointments,
  createAppointment,
  editAppointment,
  deleteAppointments,
} = require("../controllers/item.controller");

router.post("/verify", verifyToken);
router.post("/register", register);
router.post("/login", login);
router.get("/general", getAllAppointments);
router.post("/createAppointment", createAppointment);
router.post("/editAppointment", editAppointment);
router.delete("/deleteAppointments", deleteAppointments);
module.exports = router;
